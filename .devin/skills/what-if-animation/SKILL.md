---
name: What If Animation
description: Make a "What If" animated episode from one topic line ("What if you could rewind 10 seconds?"), in the dusk-lit stick-figure style of the What If channels that broke out on YouTube in October 2026. Writes the script on the seven-beat What If formula, voices it with Gemini TTS (two speakers, one request, per-line emotion), lays out a shot list at the genre's pace, renders a storyboard of stills and self-checks it before animating, animates every frame in code (Remotion and SVG, with an original cast on one rig, rooms in perspective and light from lamps and windows), generates and syncs the sound (ElevenLabs SFX), and masters a finished 15-25 s episode to -14 LUFS. Use when someone asks for a What If episode, animation or cartoon, "make a what if video about X", a stick-figure explainer in this style, or to run the free What If skill.
---

# What If animation

The canonical skill lives at the project root, beside the files it needs. From this file's directory it is three levels
up: the folder that contains `SKILL.md`, `references/`, `scripts/` and `studio/`.

## Load it first

1. Read `<project>/SKILL.md` in full. It is the pipeline; follow it in order: script, voice, shot list, storyboard,
   self-check, animate, sound, master.
2. Read the reference it names at each step: `references/formula.md` (script), `references/voice.md` (the Gemini
   TTS voice: two speakers, emotion per line, one request, Whisper timestamps), `references/look.md` (shot
   vocabulary and the storyboard and motion checklists), `references/kit.md` (engine, cast, sets, light, UI),
   `references/sound.md`, and `references/traps.md` before inventing a fix.
3. Treat `<project>` as `<skill>` in every command it gives. The studio is already installed at `<project>/studio`, with
   the `rewind` and `copy-paste` episodes ready to render: read the episode closest to the topic in
   `studio/src/episodes/` before writing a new one. Do **not** copy the studio again and do not create `what-if-studio/`.
4. Every episode lives in `studio/src/episodes/<slug>/`, its audio in `studio/public/<slug>/`, its output in
   `studio/out/<slug>/`. Run the studio commands from `<project>/studio`.

## Rules that hold before you even read the pipeline

- **Original characters only:** Pip, Mo, the sister, mum and the suit on the rig. Never a channel's hero
  and nothing that resembles a famous cartoon character; check a new look on the cast sheet.
- **Original stories:** the formula is shared, the episode isn't anyone else's. Search YouTube for the premise first.
- **Keys by name only:** `GEMINI_API_KEY`, `GEMINI_API_KEY_2`, `GEMINI_API_KEY_3` (voice, tried in order) and
  `ELEVENLABS_API_KEY`, `ELEVENLABS_API_KEY_2` (sound effects), from the environment or a `.env` above the studio.
  If a key fails, automatically try the next one. Never print, paste or hardcode a key in conversation.
- **Report the costs** of every run: Gemini TTS spends free-tier quota (~15 requests/day, one per episode — no
  credits); ElevenLabs credits for sound effects are logged to `out/<slug>/costs.json` and `report.json` — read the
  account counter fresh at hand-over time, it can lag.
- **Storyboard before animation:** no video render until the stills pass the self-check.
- **Every fact is real:** work the number out and source it in the episode's `science` field before it is voiced.
- **Script splitting:** If the script is too long, manually split it into pages (script/page1.txt, script/page2.txt, etc.)
  by content boundaries - do NOT use code for splitting. Each page should be a coherent section.
- **GitHub Actions rendering:** Video will be rendered on GitHub Actions, not locally. Adjust workflow accordingly -
  prepare assets and scripts for CI/CD pipeline rather than local rendering.

## First run on this machine

Check Node 18+, `ffmpeg` and `ffprobe` on PATH, Python 3.9+ with `numpy` and `Pillow`, a Whisper install for word
timestamps, and `GEMINI_API_KEY` (+ `_2`, `_3` fallbacks) and `ELEVENLABS_API_KEY` in a `.env` at the project root.
Then install the studio once: `cd <project>/studio && npm install`. After that, a run is:
`/what-if What if you could pause everyone but you?`

## GitHub Actions rendering

Video rendering is done via `.github/workflows/render-what-if.yml` at the project root — **video-only, no
voice or sound API calls, nothing spent**. Push to `main` or dispatch the workflow with a slug.

What must be committed for a render to work: `episode.json`, `shots.tsx`, `index.tsx`, `timeline.json` and
`words.json` under `studio/src/episodes/<slug>/`. Generated audio under `studio/public/<slug>/` is gitignored and
not needed — the workflow strips audio from the timeline and outputs a **silent** `<slug>-final.mp4` (plus
`report.json`) as workflow artifacts. Mux voice/sfx/music onto it locally afterwards.

Pipeline inside the workflow: `plan` splits `timeline.json`'s total frames into up to 32 chunks (~1500 frames each),
`render` runs `remotion render --frames=start-end` per chunk as parallel matrix jobs, `join` concatenates the parts
with ffmpeg and runs `master.py <slug> --skip-render` (silent renders skip loudnorm). Use Python 3.12 in CI — 3.9 is
unavailable on current Ubuntu runner images. `GEMINI_API_KEY*` / `ELEVENLABS_API_KEY*` secrets exist for any
future audio step but the shipped workflow does not use them.
