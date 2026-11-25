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


def paragraphs(text):
    return [re.sub(r'\s+', ' ', p).strip() for p in re.split(r'\n\s*\n', text.strip()) if p.strip()]


def first_tokens(para, n=5):
    return [norm(t) for t in TOKEN.findall(para.lstrip('"“”\' -–—')) if len(norm(t)) > 1][:n]


def norm(w):
    return re.sub(r"[^\w']", '', w.lower().replace('’', "'"))


def page_dur(n):
    with wave.open(str(pub / f'voice_p{n}.wav'), 'rb') as w:
        return w.getnframes() / w.getframerate()


def para_starts(n, paras):
    """Local start seconds of each paragraph: the first word's time in words_pN.json,
    searched forward from the previous paragraph's word so repeats land in order."""
    words = load_json(out / f'words_p{n}.json', [])
    if not words:
        raise SystemExit(f'page {n}: run voice_story.py first (no words_p{n}.json)')
    starts, wi, prev_t = [], 0, -1.0
    for para in paras:
        toks = first_tokens(para)
        found = None
        # slide a window along the words: a position qualifies when enough of the paragraph's
        # opening words appear inside it AND one of its first three anchors the start. Whisper
        # mishears ("Her" -> "His"), so no single token is trusted alone; the earliest qualifying
        # position after the cursor wins
        need = 2 if len(toks) >= 3 else 1
        for i in range(wi, len(words)) if toks else []:
            window = [norm(x['w']) for x in words[i:i + 10]]
            score = sum(1 for t in toks if t in window)
            anchored = any(t in window[:5] for t in toks[:3])
            if score >= need and anchored and words[i]['s'] > prev_t + 0.02:
                found = i
                break
        if found is None:
            # fall back to a beat after the previous paragraph rather than failing the whole plan
            starts.append(round(prev_t + 1.2, 2))
            print(f'  ! page {n}: could not place paragraph starting "{toks[0] if toks else para[:30]}" — guessed')
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
