# Voice — Gemini TTS

The voice is **Gemini TTS** (`gemini-2.5-flash-preview-tts` by default), not ElevenLabs. One API request per
episode produces the whole soundtrack's dialogue: two speakers (male and female) interleaved, each turn with
its own emotion. ElevenLabs is kept for **sound effects only** (`references/sound.md`).

## The script becomes dialogue

`episode.json`'s `script` entries gain two fields:

```json
"script": [
  {"beat": "1 cold open", "who": "pip", "style": "cheerful, quick", "text": "Copy a cookie. Paste."},
  {"beat": "1 cold open", "who": "mo",  "style": "amazed, a little worried", "text": "Free cookies, forever?"}
]
```

- `who` maps to a speaker name in `episode.json`'s `voice` block; `style` is the turn's delivery (emotion,
  pace, tone). Omit `style` for a neutral read.
- The cast is Pip and Mo on the rig: `who` names map to the `speakers` voices, so keep the same `who` across
  episodes for the same character. Assign `who` so the voices alternate like a real conversation — the genre's
  pace comes from quick exchanges, not one narrator.
- `text` is a **verbatim transcript**: the model reads exactly what's there. Never put stage directions in it —
  emotion goes in `style`, momentary sounds (a gasp, a short pause, a laugh) go inline as `<gasp>`,
  `<short pause>` etc.

`episode.json` "voice" (all optional):

```json
"voice": {
  "model": "gemini-2.5-flash-preview-tts",
  "speakers": { "pip": "Puck", "mo": "Kore" }
}
```

`speakers` maps each `who` to a Gemini prebuilt voice name (exactly two speakers per request — male and
female). Pick contrasting voices; audition a few on the cast sheet's acting row before committing.

## One request per episode

`voice.py` builds **one** `generateContent` call: `contents` is a single user turn whose `parts` are the
script's lines in order, each `part.text` = the line and `part.speech_metadata` = `{"speaker": <voice name>,
"style": <style>}`. `generation_config.speech_config.multi_speaker_voice_config` lists the two
`speaker_voice_configs`. The response's inline audio data **is the whole episode's voice track** — one WAV,
no stitching.

- **Free tier is ~15 requests/day** (3 RPM). Budget it: one take per episode. Get the script, the speaker
  mapping and the styles right *before* calling; retuning `gaps` afterwards reuses the cached take for free.
- **Key fallback:** `GEMINI_API_KEY`, then `GEMINI_API_KEY_2`, then `GEMINI_API_KEY_3`, from the environment
  or `.env` above the studio. On 429/403 move to the next key automatically. Never print or hardcode a key.
- The take is cached by a hash of (lines, speakers, model, styles): re-running `voice.py` with unchanged
  input never calls the API again.

## Timestamps come from Whisper

Gemini TTS returns audio only — no word alignment. `voice.py` transcribes `voice_raw.wav` with **Whisper**
(word timestamps on) to produce `words.json` for `plan.py` and the `edit` cues. Whisper's word times are
good enough for shot cues; if a cue lands off, nudge the cue word rather than the audio.

Then the same post-pass as before: `gaps` in `episode.json` tighten pauses to the genre's pace, writing
`public/<slug>/voice.wav` and the final `words.json`. Check the length stays 15-25 s.

**Dialogue vs narration.** In the long-story format (`voice_story.py`), `turns_pN.json` marks *every* turn
`"Narrator"` — the `you`/`other` tags in `speakers.json` only pick the delivery `style`, not a different voice
(only `emma` gets the second voice). So the voice can't tell you which words are spoken lines. To time dialogue
(for speech bubbles or lip-sync-ish acting), re-parse the quoted spans out of `script/<slug>/pageN.txt` and align
them sequentially against `words.json` — narration words sit between them, so match each quote's full word
sequence and skip forward. Watch for Whisper merging stutters ("I... I" can come back as one "I"); fix those few
by hand from the word list.

## Costs

Gemini TTS on the free tier costs **no credits** — it spends daily quota instead. Report the quota used
(1 request = 1 episode) and the ElevenLabs credits for sound effects; `out/<slug>/costs.json` logs both.
