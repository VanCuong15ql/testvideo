---
name: what-if-animation
description: Make a "What If" animated episode from one topic line ("What if you could rewind 10 seconds?"), in the dusk-lit stick-figure style of the What If channels that broke out on YouTube in October 2026. Writes the script on the seven-beat What If formula, voices it with Gemini TTS (two speakers, one request, per-line emotion), lays out a shot list at the genre's pace, renders a storyboard of stills and self-checks it before animating, animates every frame in code (Remotion and SVG, with an original cast on one rig, rooms in perspective and light from lamps and windows), generates and syncs the sound (ElevenLabs SFX), and masters a finished 15-25 s episode to -14 LUFS. Use when someone asks for a What If episode, animation or cartoon, "make a what if video about X", a stick-figure explainer in this style, or to run the free What If skill.
---

# What If animation

One topic line in, a finished 15-25 second episode out. Every frame is SVG that Claude writes (rendered by
Remotion); the voice comes from Gemini TTS (two speakers, one request per episode, emotion per line) and the
sound effects from ElevenLabs. Two examples ship in `studio/src/episodes/`, both ready to
render: `rewind` ("What if you could rewind 10 seconds?", the proof clip: shots played backwards as the power) and
`copy-paste` ("What if you could copy and paste anything?", the skill's first full run: a new kitchen set, a
schematic for the science beat, a cliffhanger blackout). Read the one closest to your topic before you start.

| File | What's in it |
|---|---|
| `references/formula.md` | The seven-beat What If formula, the 15-25 s shape, script rules, choosing a topic |
| `references/look.md` | The measured look, pace, shot vocabulary, and the storyboard and motion checklists |
| `references/kit.md` | The building blocks: engine, cast, sets, room kit, light, UI, looks, and how to add each |
| `references/sound.md` | Writing sound events, prompts, levels, costs |
| `references/voice.md` | The Gemini TTS voice: two speakers, per-line emotion, one request, Whisper timestamps |
| `references/traps.md` | Everything that cost time on the two example episodes |
| `studio/` | The Remotion project: copy it once, then every episode lives in it |
| `scripts/` | voice, plan, stills, board, sfx, mixcheck, motiongrid, master (Python 3.9+ and Node) |

## Rules

- **Original characters only.** Pip (the hero, look B) and Mo (his friend) are ours, and so are the sister, mum and
  the suit on the rig. Never a channel's own hero, and nothing that resembles a famous cartoon character: check every
  new look on the cast sheet (Mo's first hat was dropped for drifting toward one).
- **Original stories.** The formula is shared; the episode isn't anyone else's. Don't remake a channel's title.
- **Never claim the viral channels are made with Claude** or any other tool. Nobody has said how they're made.
- **Keys by name only.** Voice: `GEMINI_API_KEY`, `GEMINI_API_KEY_2`, `GEMINI_API_KEY_3` — tried in order,
  falling back on failure. Sound: `ELEVENLABS_API_KEY` and `ELEVENLABS_API_KEY_2`, same fallback. All from the
  environment or a `.env` above the studio. Never print, paste or hardcode a key.
- **Report the costs** of every run: Gemini TTS spends free-tier daily quota (~15 requests/day, one request per
  episode — no credits); ElevenLabs credits for sound clips are logged to `out/<slug>/costs.json` and totalled
  in `report.json`, read fresh from the account at hand-over time (the counter can lag; re-read before reporting).
  Say the numbers when you hand the episode over.
- **Storyboard before animation.** No video render until the stills pass the self-check (step 5) and, when the person
  is in the loop, they've seen the board.
- **Every fact is real.** A number in the script is worked out and sourced in the episode's `science` field first.
- **Script splitting.** If the script is too long, manually split it into pages (script/page1.txt, script/page2.txt, etc.)
  by content boundaries - do NOT use code for splitting. Each page should be a coherent section.
- **Story pipeline (long scripts).** After `voice_story.py` voices the pages, run `python scripts/plan_story.py <slug>`
  from `studio/`: it writes `episode.json` (one shot per paragraph, ids `P{n}S{k}`) and a brief per scene in
  `out/<slug>/scenes/`. Scenes (~10 paragraphs) are the unit of parallel work — each agent implements
  `shots/p{n}c{m}.tsx` exporting `{mod}Shots: ShotMap`; `shots.tsx` merges them all. Then `plan.py` builds
  `timeline.json` as usual. See `episodes/crush/` for the pattern.
- **GitHub Actions rendering.** Video is rendered on GitHub Actions, not locally (see "Rendering on GitHub Actions"
  below). Prepare assets and scripts for CI/CD rather than local rendering: commit `timeline.json` and `words.json`,
  keep generated audio out of git, and expect the runner to produce a silent MP4 you mux audio onto yourself.

## Setup (once per machine)

Needs Node 18+, ffmpeg and ffprobe on the PATH, Python 3.9+ with `numpy` and `Pillow`, Whisper for word
timestamps, and Gemini (`GEMINI_API_KEY` + fallbacks) and ElevenLabs (`ELEVENLABS_API_KEY`) keys.

```bash
cp -r <skill>/studio ./what-if-studio && cd what-if-studio && npm install
```

Everything below runs from that studio folder; `<skill>` is this skill's folder. To work offline or in your own
brand face, put a display font in `public/fonts/` and set `titleFont` in `src/studio.config.ts` (the default title
face, Bricolage Grotesque, and the UI faces load from Google Fonts at render time). To update an existing studio to
a newer engine, copy `<skill>/studio/src/engine` over its `src/engine`.

## The pipeline

Work through the steps in order. Each ends on something you look at before the next.

### 1. Script

Read `references/formula.md`. Search YouTube for the premise first: if a What If channel already has that exact
episode, change the power or the rule. From the topic line, decide the power's word, its rule, three escalating
demos and the turn (one real fact with a number). Write `src/episodes/<slug>/episode.json` with `id` (PascalCase,
the composition name), `slug`, `topic`, `title` (two lines), `script` (one entry per beat) and `science` (each fact:
the claim, the working, the source). 45 to 65 words. Read it aloud at pace: every line must be a picture.

### 2. Voice

Read `references/voice.md`. The script is dialogue: each `script` entry gets `who` (one of the two speakers)
and `style` (that line's emotion). Then:

```bash
python <skill>/scripts/voice.py <slug>
```

One Gemini TTS request returns the whole episode's voice track (two voices, per-line emotion — free tier is
~15 requests/day, so the take is precious: get the script and styles right first). Whisper transcribes it for
word timestamps, then the pauses are cut to the genre's pace: `public/<slug>/voice.wav` and
`src/episodes/<slug>/words.json`. Check the length (15-25 s) and the word times it prints. Retune pauses with
`gaps` in `episode.json` and re-run: the take is cached, so that's free. Change a line and it calls the API
again — a quota spent.

### 3. Shot list

Design one shot per picture in the script (usually 9 to 14), varying the size and angle every cut (wide, insert,
medium, close-up, over the shoulder, high, low; see `references/look.md`). Add to `episode.json`:

- `shots`: `{ "id": "S1", "size": "medium", "set": "kitchen", "key": 14, "note": "what we see" }` (`key` is the
  frame of the shot's own clock the storyboard shows)
- `edit`: `{ "shot": "S1", "at": "cookie" }` per cut, cued on the word it lands on (`plan.py` lists the cue forms;
  `reverse`, `from`, `to` and `look` for powers that bend a shot's clock)
- `fx`: one-frame flashes and shakes, `{ "at": "S3+2", "kind": "flash" }`

```bash
python <skill>/scripts/plan.py <slug>
```

It writes `timeline.json` and `out/<slug>/shotlist.md` and prints the pace. Aim for 27+ cuts a minute in the
opening and no static shot over about 3 s; fix what it flags before drawing anything.

### 4. Storyboard

Read `references/kit.md` for the building blocks. Write `src/episodes/<slug>/shots.tsx`, one component per shot,
each a pure function of its clock `t` (copy the patterns in the two examples' `shots.tsx`), and `index.tsx` (the
episode and its power look), then add the episode to `src/episodes/index.ts`. At this step each shot only needs to
be right at its `key` frame. When a topic needs a place the library lacks, build it with the room kit and add it to
`src/engine/sets/` (and to the skill's copy) so the next episode has it, as the copy-paste run did with the kitchen
and the schematic. A new character or costume: add the look, then check it on the cast sheet
(`npx remotion still src/index.ts Cast out/cast.png`).

```bash
npx tsc --noEmit
node <skill>/scripts/stills.mjs <slug>
python <skill>/scripts/board.py <slug>
```

`out/<slug>/storyboard.jpg`: one captioned still per shot.

### 5. Self-check the stills

Look at the storyboard, then open every still in `out/<slug>/board/` at full size, and run the storyboard checklist
in `references/look.md` honestly, shot by shot. Write down what fails, fix it, re-render just those shots
(`stills.mjs <slug> S3 S7`), rebuild the sheet and look again. Repeat until it passes. Check `references/traps.md`
for the failure you're seeing before inventing a fix. If the person is in the loop, show them the board now and
take their notes before animating.

### 6. Animate

Bring each shot to life from its key pose: `poseAt` keys with anticipation, holds and overshoot, `faceAt` for
expressions, camera moves with `kf`, the power's look, the `fx`. Then render a draft and check the motion:

```bash
python <skill>/scripts/master.py <slug>
python <skill>/scripts/motiongrid.py <slug> S2 S5
node <skill>/scripts/stills.mjs <slug> --frames 120 240
```

Read the grids like a flipbook against the motion checklist in `references/look.md`; fix and re-render until it
reads.

### 7. Sound

Read `references/sound.md`. Add `sound` to `episode.json`: the clips (prompt and length), one event per visible
action cued to its shot, ambiences per location, the music bed and the levels. Check what the library already has,
then generate:

```bash
python <skill>/scripts/sfx.py <slug> --dry
python <skill>/scripts/sfx.py <slug>
```

It prints the credits it used and sets the stem volumes in `timeline.json`. Then check that every word stays clear:

```bash
python <skill>/scripts/mixcheck.py <slug>
```

It lists the moments, while a word is being spoken, where effects or music come within 3 dB of the voice. A hit that
illustrates a word lands in the pause just after it, never on it; a bed (a hum, a drone) under a key line comes down;
if most of the stem crowds the voice, lower `sfx_lu`. Re-run sfx.py and the check until only deliberate overlaps
remain (a title boom, a turn).

### 8. Master and hand over

```bash
python <skill>/scripts/master.py <slug>
```

Renders, brings the mix to -14 LUFS with peaks under -1 dBTP, and writes `out/<slug>/report.json` (length, loudness,
pace, costs). Watch the final file once through with sound. Hand over `out/<slug>/<slug>-final.mp4` and
`out/<slug>/storyboard.jpg`, with the length, the Gemini quota and ElevenLabs credits used, and anything you'd
still improve.

## Rendering on GitHub Actions

`.github/workflows/render-what-if.yml` renders the video on GitHub-hosted runners; push to `main` or dispatch it with
a slug. The shipped workflow is **video-only**: it never calls the voice or sound APIs, so it costs no quota or
credits. Audio
(`public/<slug>/*.wav`) is generated locally ahead of time if wanted, but the CI pass strips the audio entries from
`timeline.json` and produces a **silent** `<slug>-final.mp4` plus `report.json` as artifacts; mux the voice/sfx/music
onto it locally afterwards.

What the workflow needs committed: `episode.json`, `shots.tsx`, `index.tsx`, `timeline.json` and `words.json` (the
timing files `voice.py`/`plan.py` write — without them there is nothing to render). `public/<slug>/` audio stays
gitignored.

How it works: a `plan` job reads `timeline.json`'s `total` frames and splits them into up to 32 chunks of ~1500 frames;
a `render` matrix job runs `npx remotion render --frames=start-end` per chunk in parallel; a `join` job concatenates
the parts with `ffmpeg -f concat -c copy` into `<slug>-raw.mp4` and runs `master.py <slug> --skip-render`, which
detects the missing audio stream and copy-throughs to `-final.mp4` without loudnorm. Standard `ubuntu-latest` runners
are free on public repos, so chunk count is the lever: render wall-clock is roughly `frames / (chunks × ~4-core
throughput)` plus ~4 min of setup per job. Use Python 3.12 in CI — 3.9 is not published for the current Ubuntu
runner image. `GEMINI_API_KEY*`/`ELEVENLABS_API_KEY*` secrets are only needed if a workflow step calls the APIs;
this one doesn't.

## Where an episode lives

| Path | What |
|---|---|
| `src/episodes/<slug>/episode.json` | Everything you write: script, science, shots, edit, fx, sound |
| `src/episodes/<slug>/shots.tsx`, `index.tsx` | The drawing: one component per shot, the power's look |
| `src/episodes/<slug>/words.json`, `timeline.json` | Written by voice.py and plan.py (sfx.py adds the volumes) |
| `public/<slug>/` | voice.wav, sfx.wav, music.wav |
| `out/<slug>/` | board stills, storyboard.jpg, shotlist.md, motion grids, renders, costs.json, report.json |
| `library/sfx/` | Every generated sound clip, shared by all episodes |
