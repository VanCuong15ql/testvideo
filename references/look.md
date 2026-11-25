# The look: what the genre does, and the self-check

Measured on 21 Oct 2026, frame by frame, from the leading channel's most-viewed episode (4.2M views, 24 fps) with
ffmpeg scene detection. We learn the technique (timing, camera grammar, light); every character, set and story stays
our own. Nothing confirms how the viral channels make their videos, so never say or imply they're made with Claude
or any other tool.

## Pace

| | The genre | Our target for 15-25 s |
|---|---|---|
| Cuts per minute, opening | about 27 (first 90 s) | 27 or more; the cold open can run 40-70 with reversals |
| Median shot | 2.7 s in the opening | 0.7 to 3 s |
| Long holds | up to about 12 s, always with action inside | nothing static over about 3 s |

- Cuts come from **changing shot size**, not from motion: wide, then a macro insert, then a medium, then a close-up
  of a hand, then a reaction. No two neighbouring shots share a size and angle.
- A shot is a **time slice, not a sentence**: group short lines into one shot, split a long speech across two.
  The story planner (`plan_story.py`) already does this — cut at silence gaps, ~2.4 s per shot.
- The opening runs about twice as fast as the rest. Cut on the word: `plan.py` lands each cut 2 frames before its
  cue word.

## Light does most of the work

- A dusk palette: purple to orange sky, a low sun with soft rays behind the subject.
- **Every light comes from something you can see:** a window with the sun in it, a pendant, a wall light, a desk
  lamp, string lights, a lit doorway, city windows. Pools of light, dark corners.
- Muted, mid-dark walls (`S3` palette), so the practicals read; then `LightVeil` sinks the mid-tones further and
  leaves holes where the light falls.
- A warm rim light on every character edge, on the side facing the light (`rimId="rimR"` or `"rimL"`;
  `"rimRed"` for the turn).
- Haze, dust in the beams (`Dust`), soft bokeh. Depth of field: foreground objects blurred dark (`Foreground`),
  the middle sharp, the background soft on close-ups (`blur16` on a scaled-up set).
- Grain on twos and a soft vignette finish the frame (the engine's `Grade`).

## Shot vocabulary

- **Establishing wide:** the whole lit room, the character small in it.
- **Medium** (waist up, camera zoom about 1.6 to 2) and **close-up** (head; 3 to 4.5 for an extreme close-up).
- **Macro insert:** an object huge in frame, shallow focus (a mug, a cookie, a hand), often a high or top-down angle.
- **Over the shoulder:** a big, dark, blurred foreground figure filling a third of the frame.
- **High angle / top-down** (looking down at a desk, a landing) and **low angle** (looking up at a character against
  the sky: the rooftop's `low` prop).
- **Schematic** for the science beat: a dark grid, line icons, labels in the mono face, numbers counting.
- **Title card:** a wide establishing shot with the title over it, small first line, big second line.

## Characters

- Mostly three-quarter or profile (`yaw`), rarely face-on; the face slides toward the side they face.
- They animate very little: holds are near-still, with small hand changes. Expressions swap instantly through a
  blink (`faceAt`), never morph.
- Life comes from around them: a one-frame flash on an impact, focus rings, a timer, floating labels, dust, steam,
  a swaying lamp, a slow push-in.
- One hero who never changes. Every costume is a `Look` on the one rig, so it can't drift.

## On-screen text

Almost none. The title card, and small UI readouts in the mono face (a timer, a chip naming the power, a short
label). No speech bubbles, no "HA HA", no captions of the voice.

## The storyboard self-check (step 5)

Look at `storyboard.jpg`, then open every still at full size. Fix anything that fails, re-render those shots, look
again. Only a board that passes goes to animation.

1. **One read in a second.** At phone size the subject and the action are clear. If it needs the voice to make
   sense, reframe it.
2. **Sizes change.** No two neighbours share a size and angle; the board has wides, inserts, mediums, close-ups and
   at least one high or low angle.
3. **Light from a source.** Every shot has a visible practical or sunlight, and the subject sits in or against a
   pool of it. Mid-tones are dark; nothing is evenly lit.
4. **The character pops.** The face is the brightest, sharpest thing in its area; the rim light is on the lit side;
   no dark limb on a dark wall.
5. **Depth.** A blurred dark foreground in about a third of the shots; soft backgrounds on close-ups.
6. **The world is full — and it was designed, not improvised.** Before a scene is coded, its set gets a
   written inventory: every object in the space (fixtures, props, dressing), which layer it sits on
   (foreground / midground / background), and which characters block where. A wide should show 20+
   designed objects; a medium still shows the set's signature pieces; close-ups keep one readable
   background element. No empty wall, no floating furniture; everything that stands has legs and a
   contact shadow. Detail layers compound: trim, hardware, wear, signage, small clutter — the genre's
   rooms look lived-in, not rendered.
7. **Perspective holds.** Objects sit on their surfaces, at the right scale for the character, toward the room's
   vanishing point. A prop in a hand is hand-sized — a fraction of the body at that shot's zoom, not near
   body-height (see `traps.md`).
8. **Acting matches the line.** The expression and pose say the line without the voice; the hand that moves is the
   near one (with `yaw < 0` the far arm hides behind the body).
9. **Continuity.** Same costume, same set layout, same props in the same places across shots of one place.
10. **Only the title and readouts as text,** spelled right, inside the frame.
11. **Ours.** Nothing resembles a famous character, a channel's hero or a brand.

## Palette and type

- Dusk palette only: purple night `#221D3C`/`#2E2850` walls, warm practicals `#F2B95C`/`#FFE9B0`,
  ink outlines `#0D0A14`, accents pink `#E86A92`, teal `#8FD3FF`, gold `#E9C46A`, violet `#8B7BB8`.
  Nothing neon, nothing pure white except practical bulbs and paper.
- Two voices of type: the display face for the title card and big labels, the mono face for small
  readouts (timers, chips, room numbers), the hand face for anything "written" (chalk, notebook).
- Text is rare and small; when in doubt, cut it.
- Layout discipline: ~80px safe margin on all sides, one focal point per shot, consistent spacing
  between elements, and text NEVER overlaps characters or key art — if it does, move the camera or
  the text, don't shrink until it fits.
- Layered, not flat: every surface gets at least outline + gradient/shade + one texture or light
  pass (rim light, glow, dust, reflection). A solid-color rectangle is a placeholder, not a shot.

## Motion grammar

Movement is physics, not interpolation. Pick the helper that matches the beat:

| Helper | Use for |
|---|---|
| `easeOut` (kf default per-key `ease`) | anything entering frame, a head turn, a reach — fast start, soft land |
| `easeIn` | anything leaving frame or winding up |
| `spring(t, {damping, stiffness})` | anything that enters with weight — panels, cards, landings, stamps. `damping:12, stiffness:100` is the genre default: soft overshoot then rest. Never bare linear `t`-driven motion |
| `backOut` | pops, landings, stings — overshoot then settle (the genre's signature "boing") |
| `settle(t, amp)` | the wobble after a hit, catch or landing — decaying sine, never a hard stop |
| `shake(t, from)` | impacts the camera should feel (a hit, a slam, a snap) |
| `rnd(seed, i)` | scattering props deterministically — books, dust, confetti; never `Math.random()` |

Rules:

- **Never linear-only motion.** A bare `lerp`/`t * x` drift reads as a slide, not a move. Every
  translate, scale or rotation gets an ease; holds get a secondary motion (bob, sway, flicker).
- Entrances `easeOut`, exits `easeIn`, overshoots `backOut`, aftershocks `settle`. If a move has
  no overshoot and no settle, it probably needs one.
- `poseAt` keys carry their own `ease` — put `easeOut` on arrivals and `backOut` on the final
  landing key of a big move, not on every key.
- Idle is not still: breathing bob, blinking, dust, a sway — pick at least two per shot.
- Anticipation before the big move (a crouch, a wind-up), a 2-frame hold on the realisation beat,
  then the action lands on its word.

## The motion check (step 6)

Pull frame grids of every action shot with `motiongrid.py` and read them like a flipbook.

- Anticipation before a big move (a crouch before a step, a wind-up before a grab), a hold of 2 frames on the beat
  where the character realises, overshoot and settle on landings and catches.
- Nothing static for more than about a second: something always moves (dust, steam, a sway, a push-in).
- The action lands on its word, within about 3 frames.
- Reversals read backwards (every move derives from `t`, so it does).
- No pops: a prop never jumps between frames unless it's meant to (a paste, a flash).
