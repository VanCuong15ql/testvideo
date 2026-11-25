"""Plan a multi-page story episode: shots are time slices cut on the audio's own pauses.

    python scripts/plan_story.py <slug>

Reads   script/<slug>/pageN.txt            (paragraphs = CONTENT, not shot boundaries)
        studio/out/<slug>/words_pN.json    (word times local to the page, from voice_story.py)
        studio/public/<slug>/voice_pN.wav  (page durations, for the global offset)
Writes  studio/src/episodes/<slug>/episode.json   (shots metadata + edit with s: cues)
        studio/out/<slug>/scenes/pN_cM_brief.md    (the packet each scene-agent works from)

Shots do NOT have to equal sentences. The audio is sliced at Whisper silence gaps into
~TARGET-second shots (MIN..MAX bounds); a shot may cover one paragraph, several short
ones, or half of a long one. Paragraphs are aligned to the word stream for CONTENT
LABELS only — which paragraphs each shot illustrates — so a bad alignment can mislabel
a brief but can never break timing.

Then run  python scripts/plan.py <slug>  to build timeline.json from the s: cues.

Contract for the shots modules (studio/src/episodes/<slug>/shots/pN.tsx): implement every id
P{n}S{k} listed in the brief — one React component per shot, a pure function of t/len.
"""
import json
import re
import sys
import wave
from pathlib import Path

from wi import ep_dir, load_json, out_dir, save_json

slug = sys.argv[1]
ROOT = Path(__file__).resolve().parent.parent
script_dir = ROOT / 'script' / slug
pub = ROOT / 'studio' / 'public' / slug
out = out_dir(slug)

page_files = sorted(script_dir.glob('page*.txt'), key=lambda p: int(re.search(r'\d+', p.stem).group()))
if not page_files:
    raise SystemExit(f'No script/{slug}/pageN.txt found')

TOKEN = re.compile(r"[A-Za-zÀ-ỹ]+(?:'[A-Za-z]+)?")

# Function words carry no alignment signal — "At least, that was the plan" must not match
# "staring AT someone's shadow". Content tokens only.
STOP = set('''a an the and or but if then else when while of at by for with about into through
during before after to from up down in out on off over under again further once here there all
any both each few more most other some such no nor not only own same so than too very can will
just should now i me my we our you your he him his she her it its they them their this that these
those am is are was were be been being have has had having do does did doing would could ought as
what who whom how why'''.split())

# Shot timing: aim ~2.4 s per shot (the genre's ~24 cuts/min), never below MIN or above MAX.
TARGET, MIN_SHOT, MAX_SHOT = 2.4, 1.2, 4.6
PAUSE_GAP = 0.28   # seconds of silence that count as a cut candidate (Whisper word e -> next s)
SCENE_SHOTS = 10   # shots per scene file; each scene is one agent's work unit


def paragraphs(text):
    return [re.sub(r'\s+', ' ', p).strip() for p in re.split(r'\n\s*\n', text.strip()) if p.strip()]


def norm(w):
    return re.sub(r"[^\w']", '', w.lower().replace('’', "'"))


def content_tokens(para, head=6):
    """Distinctive words of a paragraph, in order — the only tokens allowed to anchor a match."""
    ct = []
    for t in TOKEN.findall(para):
        t = norm(t)
        if len(t) > 2 and t not in STOP and t not in ct:
            ct.append(t)
    return ct[:head]


def page_dur(n):
    with wave.open(str(pub / f'voice_p{n}.wav'), 'rb') as w:
        return w.getnframes() / w.getframerate()


def load_words(n):
    words = load_json(out / f'words_p{n}.json', [])
    if not words:
        raise SystemExit(f'page {n}: run voice_story.py first (no words_p{n}.json)')
    return words


def para_times(n, paras, words):
    """Local start seconds of each paragraph — CONTENT LABELS ONLY, timing never depends on it.

    A candidate word position qualifies when the paragraph's first content token anchors near
    the start and enough of its content tokens follow inside the window, without the span
    crossing a long silence (which would mean the window jumped into the next sentence).
    """
    wn = [norm(x['w']) for x in words]
    boundary = [True] + [
        words[i]['s'] - words[i - 1].get('e', words[i - 1]['s']) > 0.22
        for i in range(1, len(words))
    ]
    starts, wi, prev_t = [], 0, -1.0
    for para in paras:
        ct = content_tokens(para)
        found = None
        if ct:
            W = max(12, len(ct) * 3)
            need = max(1, -(-len(ct) * 3 // 5))  # ~60% of content tokens
            cset = set(ct)

            def anchor(i, reach):
                return next((j for j in range(i, min(i + reach, len(words))) if wn[j] == ct[0]), None)

            def hits_from(p, cap):
                h, last = 0, p
                for j in range(p, min(p + W, len(words))):
                    if wn[j] in cset:
                        h += 1
                        last = j
                        if h >= cap:
                            break
                return h, last

            for i in range(wi, len(words)):
                if not boundary[i] or words[i]['s'] <= prev_t + 0.02:
                    continue
                p = anchor(i, 6)
                if p is None:
                    continue
                hits, last = hits_from(p, need)
                if hits < need:
                    continue
                if any(
                    words[j + 1]['s'] - words[j].get('e', words[j]['s']) > 0.65
                    for j in range(i, last)
                ):
                    continue
                found = i
                break
            if found is None:
                # relaxed pass: any word position may start the paragraph (TTS does not always
                # pause); score = hit count, then shortest lead-in to the first content token
                best, bs = None, (-1, 99)
                for i in range(wi, len(words)):
                    if words[i]['s'] <= prev_t + 0.02:
                        continue
                    p = anchor(i, 7)
                    if p is None:
                        continue
                    hits, _ = hits_from(p, len(cset) + 2)
                    score = (hits, -(p - i))
                    if score > bs:
                        best, bs = i, score
                    if hits >= len(cset) and p == i:
                        break
                if best is not None and bs[0] >= max(1, len(cset) // 2):
                    found = best
        if found is None:
            starts.append(round(prev_t + 1.2, 2))
            print(f'  ! page {n}: could not place paragraph starting "{ct[0] if ct else para[:30]}" — guessed (label only)')
        else:
            wi = found + 1
            prev_t = words[found]['s']
            starts.append(round(prev_t, 2))
    return starts


def slice_shots(words, dur):
    """Cut the page's word stream into shots of ~TARGET s at silence gaps.

    Returns local start times (seconds). A shot begins on the first word after a pause;
    we aim for TARGET, accept any pause in [MIN, MAX], and hard-cut at a word boundary
    if the page runs past MAX without a pause. The last slice runs to `dur`.
    """
    cuts = [0.0]
    i, n = 0, len(words)
    while i < n:
        start_t = words[i]['s']
        lo = start_t + MIN_SHOT
        hi = start_t + MAX_SHOT
        target = start_t + TARGET
        # pause positions: word j starts a new sentence when the gap before it is large enough
        cands = [
            j for j in range(i + 1, n)
            if words[j]['s'] >= lo and words[j]['s'] <= hi
            and words[j]['s'] - words[j - 1].get('e', words[j - 1]['s']) > PAUSE_GAP
        ]
        if cands:
            # the pause closest to the target wins; ties prefer the earlier cut
            j = min(cands, key=lambda j: (abs(words[j]['s'] - target), words[j]['s']))
        else:
            # no usable pause: cut at the first word past MAX, or end of page
            j = next((j for j in range(i + 1, n) if words[j]['s'] > hi), n)
            if j >= n:
                break
        cuts.append(round(words[j]['s'], 2))
        i = j
    return cuts


offsets, acc = {}, 0.0
for pf in page_files:
    n = int(re.search(r'\d+', pf.stem).group())
    offsets[n] = acc
    acc += page_dur(n)

shots_meta, edit, scenes = [], [], {}
prev_g = -1.0
for pf in page_files:
    n = int(re.search(r'\d+', pf.stem).group())
    paras = paragraphs(pf.read_text(encoding='utf-8'))
    words = load_words(n)
    dur = page_dur(n)

    # content labels: when each paragraph starts (approximate — labels only)
    pt = para_times(n, paras, words) + [dur]
    spans = list(zip(pt, pt[1:]))  # paragraph k covers [spans[k][0], spans[k][1])

    # timing: silence-gap slices of the audio itself
    cuts = slice_shots(words, dur)
    bounds = cuts + [dur]
    for ci in range(len(cuts)):
        sid = f'P{n}S{ci + 1}'
        c = (ci) // SCENE_SHOTS + 1
        g = max(offsets[n] + cuts[ci], prev_g + 0.15)  # cuts must strictly increase
        prev_g = g
        # which paragraphs does this shot illustrate? those whose span overlaps it
        a, b = cuts[ci], bounds[ci + 1]
        covered = [paras[j] for j in range(len(paras))
                   if spans[j][0] < b and spans[j][1] > a]
        note = ' / '.join(covered)[:110] if covered else '(beat)'
        shots_meta.append({'id': sid, 'size': 'story', 'note': note})
        edit.append({'shot': sid, 'at': f's:{g:.2f}'})
        scenes.setdefault((n, c), []).append((sid, cuts[ci], covered))

title = paragraphs(page_files[0].read_text(encoding='utf-8'))[0].lstrip('#').strip()
ep = {
    'id': slug.capitalize(),
    'slug': slug,
    'title': [title],
    'tail': 2.5,
    'fps': 30,
    'shots': shots_meta,
    'edit': edit,
}
save_json(ep_dir(slug) / 'episode.json', ep)

# one brief per scene: the packet a scene-agent works from
(out / 'scenes').mkdir(exist_ok=True)
for (n, c), rows in sorted(scenes.items()):
    first, last = rows[0][0], rows[-1][0]
    mod = f'p{n}c{c}'
    lines = [f'# Scene {mod} — shot brief', '',
             f'Shots **{first}–{last}** of page {n}. Implement them in `studio/src/episodes/{slug}/shots/{mod}.tsx`.',
             'Each shot is `React.FC<ShotProps>` ({t, len, f} in frames @30fps), a pure function of its own clock:',
             f'`export const {mod}Shots: ShotMap = {{ {first}: ..., {last}: ... }}` — every id below must exist.',
             'Shared kit: `./common` (engine re-exports, cast looks, sets, ShadowFigure).',
             'Style reference: `studio/src/episodes/sandglass/shots.tsx`. Keep the dusk-lit stick-figure look.',
             '',
             'Design before code — put a short design note in the file header: set object inventory,',
             'depth layers (foreground/midground/background), character blocking, and a keyframe budget',
             '(every shot: >=3 independently moving elements — pose keys, camera drift, prop motion, particles).',
             'Motion grammar (references/look.md): easeOut for entrances, easeIn for exits, spring() for weighty',
             'entrances (damping 12 / stiffness 100), backOut for pops, settle() for landing wobble, shake() for',
             'impacts, rnd() for scatter — never linear-only motion.',
             'A shot covers the paragraphs listed — animate the BEATS inside it, not one image per sentence.',
             '', '| Shot | Starts (s, local) | Covers (paragraphs) |', '|---|---|---|']
    for sid, st, covered in rows:
        cov = '<br>'.join(p.replace('|', '\\|') for p in covered) or '(beat)'
        lines.append(f'| {sid} | {st:.1f} | {cov} |')
    (out / 'scenes' / f'{mod}_brief.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')

print(f'{slug}: {len(shots_meta)} shots in {len(scenes)} scenes across {len(page_files)} pages, {acc:.0f}s total')
print(f'episode.json written; scene briefs in {out}/scenes/. Next: python scripts/plan.py {slug}')
