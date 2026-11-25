"""Plan a multi-page story episode: one shot per paragraph, shot ids P<page>S<para>.

    python scripts/plan_story.py <slug>

Reads   script/<slug>/pageN.txt            (one paragraph = one shot)
        studio/out/<slug>/words_pN.json    (word times local to the page, from voice_story.py)
        studio/public/<slug>/voice_pN.wav  (page durations, for the global offset)
Writes  studio/src/episodes/<slug>/episode.json   (shots metadata + edit with s: cues)
        studio/out/<slug>/pages/pN_brief.md        (the packet each page-agent works from)

Then run  python scripts/plan.py <slug>  to build timeline.json from the voice's word timings.

Contract for the shots modules (studio/src/episodes/<slug>/shots/pN.tsx): implement every id
P{n}S{k} listed in the brief — one React component per paragraph, a pure function of t/len.
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


def para_starts(n, paras):
    """Local start seconds of each paragraph: align on CONTENT tokens only, monotonically.

    A candidate word position qualifies when the paragraph's first content token anchors the
    window and enough of its remaining content tokens appear inside it. Whisper mishears
    ("Her" -> "His"), so single tokens are never trusted alone; the earliest qualifying position
    after the cursor wins. If nothing qualifies, take the position with the most hits.
    """
    words = load_json(out / f'words_p{n}.json', [])
    if not words:
        raise SystemExit(f'page {n}: run voice_story.py first (no words_p{n}.json)')
    wn = [norm(x['w']) for x in words]
    # Whisper exposes sentence boundaries as silence gaps — a paragraph can only start on one,
    # otherwise a window slides across a pause and matches the NEXT sentence's content words.
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
                """First position of the paragraph's leading content token within `reach` words."""
                return next((j for j in range(i, min(i + reach, len(words))) if wn[j] == ct[0]), None)

            def hits_from(p, cap):
                """Content hits counted from the anchor, up to `cap`; returns (hits, last_hit_pos)."""
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
                # the first content token must sit near the start — otherwise the candidate is
                # really the PREVIOUS sentence and the hits belong to this paragraph's tail
                p = anchor(i, 6)
                if p is None:
                    continue
                hits, last = hits_from(p, need)
                if hits < need:
                    continue
                # and the span must not cross a long silence: a window that jumps a sentence
                # boundary collects the NEXT paragraph's words and fakes a match
                if any(
                    words[j + 1]['s'] - words[j].get('e', words[j]['s']) > 0.65
                    for j in range(i, last)
                ):
                    continue
                found = i
                break
            if found is None:
                # relaxed pass: same anchoring, but any word position may start the paragraph
                # (TTS does not always pause between paragraphs). Score = hit count, then the
                # shortest lead-in to the first content token — a candidate that reaches the
                # cluster from far away is the previous sentence, not this paragraph.
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
            # fall back to a beat after the previous paragraph rather than failing the whole plan
            starts.append(round(prev_t + 1.2, 2))
            print(f'  ! page {n}: could not place paragraph starting "{ct[0] if ct else para[:30]}" — guessed')
        else:
            wi = found + 1
            prev_t = words[found]['s']
            starts.append(round(prev_t, 2))
    return starts


offsets, acc = {}, 0.0
for pf in page_files:
    n = int(re.search(r'\d+', pf.stem).group())
    offsets[n] = acc
    acc += page_dur(n)

SCENE_PARAS = 10  # paragraphs per scene file; each scene is one agent's work unit

shots_meta, edit, scenes = [], [], {}
prev_g = -1.0
for pf in page_files:
    n = int(re.search(r'\d+', pf.stem).group())
    paras = paragraphs(pf.read_text(encoding='utf-8'))
    starts = para_starts(n, paras)
    for k, (para, st) in enumerate(zip(paras, starts), 1):
        sid = f'P{n}S{k}'
        c = (k - 1) // SCENE_PARAS + 1
        g = max(offsets[n] + st, prev_g + 0.15)  # cuts must strictly increase across page boundaries
        prev_g = g
        shots_meta.append({'id': sid, 'size': 'story', 'note': para[:110]})
        edit.append({'shot': sid, 'at': f's:{g:.2f}'})
        scenes.setdefault((n, c), []).append((sid, st, para))

# one brief per scene: the packet a page-agent works from
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
             '', '| Shot | Starts (s, local) | Paragraph |', '|---|---|---|']
    for sid, st, para in rows:
        lines.append(f'| {sid} | {st:.1f} | {para} |')
    (out / 'scenes' / f'{mod}_brief.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')

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
print(f'{slug}: {len(shots_meta)} shots in {len(scenes)} scenes across {len(page_files)} pages, {acc:.0f}s total')
print(f'episode.json written; scene briefs in {out}/scenes/. Next: python scripts/plan.py {slug}')
