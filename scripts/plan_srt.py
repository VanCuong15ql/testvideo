"""Plan a captioned-story episode from per-page SRT files (user-made captions).

    python scripts/plan_srt.py <slug> --srt-dir "I:/My Drive/audiovideo/caption" [--target 3.0]

Reads   script/<slug>/pageN.txt + speakers.json (for quote tags), the SRT files pageN.srt,
        and the per-page wav durations under studio/public/<slug>/voice_pN.wav.
Writes  studio/src/episodes/<slug>/plan.json   — shot list w/ cue text per shot
        studio/src/episodes/<slug>/timeline.json
        studio/src/episodes/<slug>/episode.json

Each shot groups consecutive SRT cues into ~TARGET seconds (cut at cue boundaries,
preferring gaps). Page offsets come from the real wav durations so timings are exact.
"""
import argparse, json, re, subprocess, sys, wave
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FPS = 30

def srt_time(s):
    h, m, rest = s.split(':')
    sec, ms = rest.split(',')
    return int(h) * 3600 + int(m) * 60 + int(sec) + int(ms) / 1000

def parse_srt(path):
    cues = []
    for block in re.split(r'\n\s*\n', path.read_text(encoding='utf-8-sig').strip()):
        lines = [l for l in block.strip().splitlines() if l.strip()]
        if len(lines) < 3:
            continue
        a, b = lines[1].split(' --> ')
        cues.append({'a': srt_time(a), 'b': srt_time(b), 'text': ' '.join(lines[2:]).strip()})
    return cues

def wav_dur(p):
    with wave.open(str(p), 'rb') as w:
        return w.getnframes() / w.getframerate()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('slug')
    ap.add_argument('--srt-dir', required=True)
    ap.add_argument('--target', type=float, default=3.0)
    ap.add_argument('--title', default='')
    args = ap.parse_args()

    slug = args.slug
    sdir = Path(args.srt_dir)
    epdir = ROOT / 'studio' / 'src' / 'episodes' / slug
    pub = ROOT / 'studio' / 'public' / slug
    epdir.mkdir(parents=True, exist_ok=True)

    pages = sorted(sdir.glob('page*.srt'), key=lambda p: int(re.search(r'\d+', p.stem).group()))
    assert pages, f'no page*.srt in {sdir}'

    # page offsets from real wav durations
    offsets, t = {}, 0.0
    all_cues = []  # (page, global_a, global_b, text)
    for pf in pages:
        n = int(re.search(r'\d+', pf.stem).group())
        wp = pub / f'voice_p{n}.wav'
        if not wp.exists():
            raise SystemExit(f'missing {wp} — voice the page first')
        offsets[n] = t
        dur = wav_dur(wp)
        for c in parse_srt(pf):
            all_cues.append({'page': n, 'a': t + c['a'], 'b': t + c['b'], 'text': c['text']})
        t += dur
    total_s = t

    # group cues into shots
    shots = []
    cur = []
    for c in all_cues:
        if cur:
            span = c['b'] - cur[0]['a']
            gap = c['a'] - cur[-1]['b']
            # cut before this cue if the group is long enough and there's a pause,
            # or if adding it would overshoot badly
            if (span >= args.target and gap > 0.15) or span > args.target * 1.8:
                shots.append(cur)
                cur = []
        cur.append(c)
    if cur:
        shots.append(cur)

    # frame bounds from cue times, then renumber per page and make contiguous
    shot_meta = []
    for grp in shots:
        page = grp[0]['page']
        shot_meta.append({'grp': grp, 'page': page,
                          'cue_a_f': round(grp[0]['a'] * FPS), 'cue_b_f': round(grp[-1]['b'] * FPS)})
    per_page = {}
    for m in shot_meta:
        per_page[m['page']] = per_page.get(m['page'], 0) + 1
        m['id'] = f"P{m['page']}S{per_page[m['page']]}"

    f = 0
    for m in shot_meta:
        start = f
        end = max(m['cue_b_f'], start + int(0.6 * FPS))
        m['a_f'], m['b_f'] = start, end
        f = end
    total_frames = f + int(2.5 * FPS)  # tail

    segments = []
    for m in shot_meta:
        txt = ' / '.join(c['text'] for c in m['grp'])
        segments.append({'shot': m['id'], 'a': m['a_f'], 'b': m['b_f'], 't0': 0, 't1': m['b_f'] - m['a_f'], 'line': txt[:160]})

    tl = {'slug': slug, 'title': args.title or slug, 'fps': FPS, 'total': total_frames,
          'segments': segments,
          'shots': [{'id': m['id'], 'size': 'story', 'key': m['a_f'] % 97, 'len': m['b_f'] - m['a_f'],
                     'first': m['a_f'], 'line': ' '.join(c['text'] for c in m['grp'])[:160],
                     'note': ' '.join(c['text'] for c in m['grp'])[:200]} for m in shot_meta],
          'fx': [],
          'audio': {'voice': f'{slug}/voice.wav', 'voiceVol': 0.9}}
    (epdir / 'timeline.json').write_text(json.dumps(tl, indent=1, ensure_ascii=False), encoding='utf-8')

    plan = {'slug': slug, 'title': args.title or slug, 'fps': FPS, 'total_s': total_s,
            'offsets': offsets, 'shots': [
                {'id': m['id'], 'page': m['page'], 'a': m['a_f'] / FPS, 'b': m['b_f'] / FPS,
                 'a_f': m['a_f'], 'b_f': m['b_f'], 'dur': (m['b_f'] - m['a_f']) / FPS,
                 'cues': [{'a': c['a'], 'b': c['b'], 'text': c['text']} for c in m['grp']]}
                for m in shot_meta]}
    (epdir / 'plan.json').write_text(json.dumps(plan, indent=1, ensure_ascii=False), encoding='utf-8')

    ep = {'id': slug.title().replace('_', ' '), 'slug': slug, 'title': [args.title or slug.title()],
          'tail': 2.5, 'fps': FPS,
          'shots': [{'id': m['id'], 'size': 'story', 'note': ' '.join(c['text'] for c in m['grp'])[:200]} for m in shot_meta]}
    (epdir / 'episode.json').write_text(json.dumps(ep, indent=1, ensure_ascii=False), encoding='utf-8')

    print(f'{slug}: {len(shot_meta)} shots, {total_s:.1f}s voice, {total_frames} frames -> {epdir}')
    for m in shot_meta:
        print(f"  {m['id']} p{m['page']} {m['a_f']/FPS:7.2f}-{m['b_f']/FPS:7.2f} ({(m['b_f']-m['a_f'])/FPS:4.1f}s)  {' / '.join(c['text'] for c in m['grp'])[:90]}")

if __name__ == '__main__':
    main()
