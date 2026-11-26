# AGENTS.md

What If animation studio. One topic line → a finished animated episode (Remotion + SVG, Gemini TTS voice,
ElevenLabs SFX). **Read `SKILL.md` first — it is the pipeline and the rules.** This file is the map and the
command cheat-sheet; `references/` holds the per-step detail.

## Layout

- `SKILL.md` — the pipeline (script → voice → shot list → storyboard → self-check → animate → sound → master)
  and the GitHub Actions render flow. Follow it in order.
- `references/` — formula.md, look.md, kit.md, sound.md, voice.md, traps.md (read the one each step names).
- `scripts/` — pipeline scripts (Python 3.9+, numpy+Pillow, Whisper for word times): `voice.py`, `voice_story.py`
  (multi-page stories), `plan_story.py`+`plan.py`, `stills.mjs`, `board.py`, `sfx.py`, `mixcheck.py`,
  `motiongrid.py`, `master.py`, `wi.py` (shared helpers). Run studio-dependent scripts **from `studio/`**.
- `studio/` — the Remotion project (Node 18+): `src/engine/` (rig, kit, sets, ui), `src/episodes/<slug>/`
  (episode.json, shots.tsx, index.tsx, shots/*.tsx, timeline.json, words.json), `public/<slug>/` (generated
  audio, gitignored), `out/<slug>/` (stills, storyboard.jpg, renders, report.json), `library/sfx/` (SFX cache,
  committed).
- `script/<slug>/` — pageN.txt scripts + speakers.json (long-story format; `script.txt` at root is source text).
- `.github/workflows/render-what-if.yml` — CI render, video-only.

## Commands

```bash
cd studio
npx tsc --noEmit                                  # typecheck (always run after editing shots)
node ../scripts/stills.mjs <slug>                 # storyboard stills -> out/<slug>/board/
node ../scripts/stills.mjs <slug> --frames 700 745 # arbitrary frames of the main comp -> out/<slug>/frames/
python ../scripts/sfx.py <slug> --dry             # list clips, show what's cached (no API spend)
python ../scripts/master.py <slug>                # local render + loudnorm to -14 LUFS
python ../scripts/master.py <slug> --skip-render  # loudnorm/copy an already-rendered <slug>-raw.mp4
```

## Conventions

- Episodes are `studio/src/episodes/<slug>/`, registered in `src/episodes/index.ts`; audio in
  `studio/public/<slug>/`, output in `studio/out/<slug>/`.
- Shot components are pure functions of shot-clock `t` (frames); camera via `camT(cx, cy, zoom)` maps
  world → 1920×1080 screen space. Anything that must not inherit the camera (speech bubbles, letterbox,
  full-frame UI) renders as a sibling **after** the `camT` group — see `Say` in
  `src/episodes/drawings/shots/common.tsx`.
- The character rig (`src/engine/rig.tsx`) is shared by every episode — API changes affect all of them;
  check the cast sheet (`npx remotion still src/index.ts Cast out/cast.png`) after look changes.
- Long-story episodes (e.g. `drawings`) split the script into `script/<slug>/pageN.txt`, voice per page with
  `voice_story.py`, plan with `plan_story.py`+`plan.py`; `turns_pN.json` marks all turns "Narrator" — quoted
  dialogue only differs by `style`, so re-parse quotes + align to `words.json` for dialogue timing.
- Speech bubbles for quoted dialogue: comic style, timed to word spans, tail on the speaker — pattern in
  `references/look.md` → On-screen text.

## Git & CI

- Video renders on GitHub Actions only (push to `main` or `workflow_dispatch` with a slug). The workflow is
  video-only/silent — no API spend. It resolves the slug from the push diff (falls back to the most recently
  touched episode), splits `timeline.json` into ~320-frame jobs (cap 20), renders chunks in parallel, joins
  them, and uploads `what-if-<slug>-video` + `what-if-<slug>` artifacts. Concurrency group cancels stale runs.
- Must be committed for a render: `episode.json`, `shots.tsx`, `index.tsx`, `timeline.json`, `words.json` under
  the episode dir. `public/` audio and `out/` are gitignored; `library/sfx/` IS committed (SFX cache).
- Artifact download needs a GitHub token even on public repos. Finish audio locally afterwards — the ffmpeg
  amix recipe is in SKILL.md → Rendering on GitHub Actions.
- `scripts/`, `references/`, `SKILL.md` doc-only pushes still trigger a render of the latest episode; keep
  that in mind before pushing docs mid-render.

## Costs

- Voice: Gemini TTS free tier (~15 requests/day, one per episode/page batch). Keys by env name only:
  `GEMINI_API_KEY`, `_2`, `_3`.
- SFX: ElevenLabs credits, logged to `out/<slug>/costs.json`; reuse `library/sfx/` clips verbatim to spend $0.
  Keys: `ELEVENLABS_API_KEY`, `_2`. Never print or hardcode keys.
