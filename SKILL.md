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
- **Depth order is explicit.** Any set with several object or character layers declares its draw order
  back-to-front (background → midground → foreground → near-camera). Characters and props slot into that order by
  depth, so a far object can never cover something nearer — verify on the board stills, not by eye at render time.
- **New sets are shared.** A background/room built for one episode is saved into the shared `room` folder
  (`src/engine/sets/`, mirrored to the skill's copy) so later episodes reuse or improve it — never left inline in a
  scene file.
- **Every fact is real.** A number in the script is worked out and sourced in the episode's `science` field first.
- **Script splitting.** If the script is too long, manually split it into pages (script/page1.txt, script/page2.txt, etc.)
  by content boundaries - do NOT use code for splitting. Each page should be a coherent section.
- **Story pipeline (long scripts).** After `voice_story.py` voices the pages, run `python scripts/plan_story.py <slug>`
  from `studio/`: it writes `episode.json` (shots `P{n}S{k}` + `s:` cues) and a brief per scene in
  `out/<slug>/scenes/`. **Shots are time slices, not sentences** — the planner cuts the audio at Whisper
  silence gaps into ~2.4 s shots (1.2–4.6 s bounds), so a shot can cover several short paragraphs or half of a
  long one; paragraphs are aligned to the word stream for content labels only (which paragraphs each shot
  illustrates), and timing never depends on that alignment. Scenes (~10 shots) are the unit of parallel work —
  each agent implements `shots/p{n}c{m}.tsx` exporting `{mod}Shots: ShotMap`; `shots.tsx` merges them all. Then
  `plan.py` builds `timeline.json` as usual. See `episodes/crush/` for the pattern.
- **Captioned-story variant (user-made SRT).** When the person captions the audio themselves, the pipeline stops
  after voicing: **clean `I:\My Drive\audiovideo\audio\` first** (delete stale `pageN.wav`/old takes so only the
  current run's files remain), then copy each `studio/public/<slug>/voice_pN.wav` there as `pageN.wav`, hand
  over, and wait — they produce the SRT into `I:\My Drive\audiovideo\caption\` and reply. Skip
  `plan_story.py`/`plan.py`/shots entirely for that flow. `speakers.json` may set `"language"` (e.g. `"vi"`) for
  Whisper word timestamps.
- **Design before code, per scene.** Before writing a scene's shots, write its design note (in the scene file's
  header comment or the brief): the set's object inventory, the depth layers (foreground/midground/background),
  where each character blocks, and the keyframe budget — every shot gets ≥3 independently moving elements
  (pose keys, motivated camera moves, prop motion, particles). **Camera moves must be motivated:** zoom or pan
  only toward the thing the shot is focusing on — never a generic slow push or drift on every shot; a static or
  barely-moving camera is fine when nothing needs emphasis. Sets are shared kit pieces in `shots/common.tsx`; extend
  them rather than inventing one-off backgrounds. See `episodes/crush/shots/common.tsx` (`Hallway`,
  `Question5Board`, `HallForeground`) for the pattern. **Scene-by-scene review:** render the scene's board
  stills (`node scripts/stills.mjs <slug> <shot ids>`) and check them before writing the next scene — fix the
  set and motion in that scene's file rather than letting a weak background propagate to the rest.
- **Model and reasoning.** Plumbing (pipeline scripts, type fixes) is fine on fast models; the design passes —
  set dressing, layout, motion feel — deserve the strongest available model at high reasoning. If a video
  looks stiff or ugly, the fix is usually a design pass, not more code.
- **Remotion agent skills (optional).** `npx skills add remotion-dev/skills` installs Remotion's official
  agent skills for generic Remotion best practices; our shot model is pure functions of `t` (not
  `<Sequence>`/`interpolate`), so treat them as reference, not rules. Their spring guidance maps onto our
  `spring(t, {damping, stiffness})` helper in `engine/anim.ts` (damping 12 / stiffness 100 = the default pop).
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
be right at its `key` frame. When a topic needs a place the library lacks, build it with the room kit and save it to
the shared `room` folder (`src/engine/sets/`, and to the skill's copy) so the next episode has it, as the
copy-paste run did with the kitchen and the schematic. A new character or costume: add the look, then check it on the cast sheet
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

It prints the credits it used and sets the stem volumes in `timeline.json`. Clips are cached in
`studio/library/sfx/` by name + prompt + length: copy a clip entry **verbatim** (prompt and seconds) from another
episode's `sound` section and it costs nothing — check `sfx.py <slug> --dry` first to see what's already cached.
Only write new prompts for sounds the library lacks. Run it from the `studio/` folder (it errors from anywhere
else). Then check that every word stays clear:

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

How it works: a `plan` job reads `timeline.json`'s `total` frames and derives the job count from a per-job frame
budget (~320 frames, the sweet spot between fixed setup cost and parallelism; capped at 20 jobs and never below
200 frames/chunk — see the `plan` step in the workflow for the exact rule); a `render` matrix job runs
`npx remotion render --frames=start-end` per chunk in parallel; a `join` job concatenates the parts with
`ffmpeg -f concat -c copy` into `<slug>-raw.mp4` and runs `master.py <slug> --skip-render`, which detects the
missing audio stream and copy-throughs to `-final.mp4` without loudnorm. The workflow also sets a concurrency
group with `cancel-in-progress`, so pushing again supersedes a stale render instead of doubling it. Standard
`ubuntu-latest` runners are free on public repos; render wall-clock is roughly `frames / (jobs × ~4-core
throughput)` plus ~2 min of setup per job. Use Python 3.12 in CI — 3.9 is not published for the current Ubuntu
runner image. `GEMINI_API_KEY*`/`ELEVENLABS_API_KEY*` secrets are only needed if a workflow step calls the APIs;
this one doesn't.

**After pushing, stop.** The render takes tens of minutes on CI — do not keep working or re-push; end the turn
and wait for the user to say the GitHub render is done before downloading artifacts or muxing audio.

**Finishing the audio locally — keep it fast.** The artifacts are `what-if-<slug>-video` (`<slug>-final.mp4`,
silent) and `what-if-<slug>` (`report.json`). The artifact API needs a token even on public repos — download
with the same credential git push uses. Then mux the stems onto the silent video in **one command** — do not
iterate on loudnorm (a 13-minute file makes every ffmpeg pass minutes long; the summed stems can clip, so the
limiter is required):

```bash
cd studio
ffmpeg -i out/<slug>/ci/video/<slug>-final.mp4 \
  -i public/<slug>/voice.wav -i public/<slug>/sfx.wav -i public/<slug>/music.wav \
  -filter_complex "[1:a]volume=<voiceVol>[v];[2:a]volume=<sfxVol>[s];[3:a]volume=<musicVol>[m];[v][s][m]amix=inputs=3:duration=longest:normalize=0,alimiter=limit=0.7[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -movflags +faststart \
  out/<slug>/<slug>-final.mp4
```

(`<voiceVol>`/`<sfxVol>`/`<musicVol>` are `audio.*Vol` in `timeline.json`.) Skip the stems that don't exist
(voice-only page: just `voice.wav`). Do **not** use `-shortest` — the voice is shorter than the video and it
would cut the tail. Result lands around -15 to -16 LUFS — close enough; only run `master.py <slug>
--skip-render` for a true -14 LUFS pass if the user asks for it.

## Where an episode lives

| Path | What |
|---|---|
| `src/episodes/<slug>/episode.json` | Everything you write: script, science, shots, edit, fx, sound |
| `src/episodes/<slug>/shots.tsx`, `index.tsx` | The drawing: one component per shot, the power's look |
| `src/episodes/<slug>/words.json`, `timeline.json` | Written by voice.py and plan.py (sfx.py adds the volumes) |
| `public/<slug>/` | voice.wav, sfx.wav, music.wav |
| `out/<slug>/` | board stills, storyboard.jpg, shotlist.md, motion grids, renders, costs.json, report.json |
| `library/sfx/` | Every generated sound clip, shared by all episodes |
