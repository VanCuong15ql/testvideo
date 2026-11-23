---
name: What If Animation
description: Make a "What If" animated episode from one topic line ("What if you could rewind 10 seconds?"), in the dusk-lit stick-figure style of the What If channels that broke out on YouTube in October 2026. Writes the script on the seven-beat What If formula, voices it with ElevenLabs, lays out a shot list at the genre's pace, renders a storyboard of stills and self-checks it before animating, animates every frame in code (Remotion and SVG, with an original cast on one rig, rooms in perspective and light from lamps and windows), generates and syncs the sound, and masters a finished 15-25 s episode to -14 LUFS. Use when someone asks for a What If episode, animation or cartoon, "make a what if video about X", a stick-figure explainer in this style, or to run the free What If skill.
---

# What If animation

The canonical skill lives at the project root, beside the files it needs. From this file's directory it is three levels
up: the folder that contains `SKILL.md`, `references/`, `scripts/` and `studio/`.

## Load it first

1. Read `<project>/SKILL.md` in full. It is the pipeline; follow it in order: script, voice, shot list, storyboard,
   self-check, animate, sound, master.
2. Read the reference it names at each step: `references/formula.md` (script), `references/look.md` (shot vocabulary and
   the storyboard and motion checklists), `references/kit.md` (engine, cast, sets, light, UI), `references/sound.md`,
   and `references/traps.md` before inventing a fix.
3. Treat `<project>` as `<skill>` in every command it gives. The studio is already installed at `<project>/studio`, with
   the `rewind` and `copy-paste` episodes ready to render: read the episode closest to the topic in
   `studio/src/episodes/` before writing a new one. Do **not** copy the studio again and do not create `what-if-studio/`.
4. Every episode lives in `studio/src/episodes/<slug>/`, its audio in `studio/public/<slug>/`, its output in
   `studio/out/<slug>/`. Run the studio commands from `<project>/studio`.

## Rules that hold before you even read the pipeline

- **Original characters only:** Pip, Mo, the sister, mum and the suit on the rig. Never a channel's hero and nothing
  that resembles a famous cartoon character; check a new look on the cast sheet.
- **Original stories:** the formula is shared, the episode isn't anyone else's. Search YouTube for the premise first.
- **Keys by name only:** `ELEVENLABS_API_KEY`, from the environment or a `.env` above the studio. Never print, paste or
  hardcode a key.
- **Report the ElevenLabs credits** of every run, read fresh from the account at hand-over time.
- **Storyboard before animation:** no video render until the stills pass the self-check.
- **Every fact is real:** work the number out and source it in the episode's `science` field before it is voiced.

## First run on this machine

Check Node 18+, `ffmpeg` and `ffprobe` on PATH, Python 3.9+ with `numpy` and `Pillow`, and `ELEVENLABS_API_KEY` in a
`.env` at the project root. Then install the studio once: `cd <project>/studio && npm install`. After that, a run is:
`/what-if What if you could pause everyone but you?`
