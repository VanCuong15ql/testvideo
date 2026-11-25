"""Voice a multi-page story script with Gemini TTS (two speakers, per-line style), then Whisper word times.

    python scripts/voice_story.py <slug> [page ...]

Reads   script/<slug>/pageN.txt  (plain story text; "..." spans are dialogue)
        script/<slug>/speakers.json  {"quotes": ["emma"|"you"|"other", ...]} — one tag per quoted line, in order
Writes  studio/public/<slug>/voice_pN.wav  (44.1 kHz mono) and voice.wav (all pages concatenated)
        studio/out/<slug>/words_pN.json, words.json (word timings, pages offset)
        studio/out/<slug>/turns_pN.json (the exact turns sent to the API, for review)

Gemini keys: GEMINI_API_KEY, _2, _3 from the environment or a .env above the studio. One API request per
page; a page whose wav already exists is skipped (free re-runs).
"""
import base64, hashlib, json, re, sys, time, urllib.error, urllib.request, wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
STUDIO = ROOT / 'studio'
SR = 44100
MODEL = 'gemini-3.8-flash-tts'  # 2.5-flash-preview-tts rejects speechMetadata; 3.8 accepts it
VOICES = {'Narrator': 'Charon', 'Emma': 'Leda'}  # male storyteller / sweet young female

slug = sys.argv[1]
pages = [int(a) for a in sys.argv[2:] if a.isdigit()] or None
script_dir = ROOT / 'script' / slug
pub = STUDIO / 'public' / slug
out = STUDIO / 'out' / slug
pub.mkdir(parents=True, exist_ok=True)
out.mkdir(parents=True, exist_ok=True)

spec = json.loads((script_dir / 'speakers.json').read_text(encoding='utf-8'))
QUOTE_TAGS = spec['quotes']          # 'emma' -> female voice, anything else -> male voice
STYLE_OVERRIDE = spec.get('styles', {})  # {quote_index: style}
NARR_STYLE = spec.get('narration', 'warm, clear, engaging storyteller')
BASE_STYLE = {'emma': 'sweet, warm, youthful, natural', 'you': 'casual, friendly, natural', 'other': 'neutral, clear'}

QUOTE = re.compile(r'"([^"]+)"')


def turns_of(text, qi=0):
    """Paragraph text -> ([(speaker_key, text, style)], next_quote_index). Quoted spans become dialogue
    turns; the narration around them becomes Narrator turns. `qi` continues the global quote count."""
    turns = []
    for para in re.split(r'\n\s*\n', text.strip()):
        pos = 0
        for m in QUOTE.finditer(para):
            before = para[pos:m.start()].strip()
            if before:
                turns.append(('Narrator', before, NARR_STYLE))
            tag = QUOTE_TAGS[qi]
            qi += 1
            key = 'Emma' if tag == 'emma' else 'Narrator'
            style = STYLE_OVERRIDE.get(str(qi - 1), BASE_STYLE[tag])
            turns.append((key, m.group(1).strip(), style))
            pos = m.end()
        tail = para[pos:].strip()
        if tail:
            turns.append(('Narrator', tail, NARR_STYLE))
    return turns, qi


def env_keys():
    vals = []
    for n in ('GEMINI_API_KEY', 'GEMINI_API_KEY_2', 'GEMINI_API_KEY_3'):
        v = __import__('os').environ.get(n)
        if v:
            vals += [x.strip() for x in re.split(r'[,\s]+', v) if x.strip()]
    for d in [STUDIO, *STUDIO.parents, ROOT]:
        p = d / '.env'
        if p.exists():
            raw = p.read_bytes()
            txt = raw.decode('utf-16', errors='ignore') if raw[:2] in (b'\xff\xfe', b'\xfe\xff') else raw.decode('utf-8-sig', errors='ignore')
            for line in txt.splitlines():
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    if k.strip().startswith('GEMINI_API_KEY'):
                        vals += [x.strip().strip('"').strip("'") for x in re.split(r'[,\s]+', v.strip()) if x.strip()]
    seen, out = set(), []
    for v in vals:
        if v not in seen:
            seen.add(v)
            out.append(v)
    if not out:
        raise SystemExit('No GEMINI_API_KEY* in environment or .env')
    return out


def tts(turns):
    parts = [{'text': t, 'speechMetadata': {'speaker': sp, 'style': st}} for sp, t, st in turns]
    body = {
        'contents': [{'role': 'user', 'parts': parts}],
        'generationConfig': {
            'responseModalities': ['AUDIO'],
            'speechConfig': {'multiSpeakerVoiceConfig': {'speakerVoiceConfigs': [
                {'speaker': sp, 'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': vn}}} for sp, vn in VOICES.items()]}},
        },
    }
    last = None
    for key in env_keys():
        url = f'https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={key}'
        req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                res = json.loads(r.read())
            data = res['candidates'][0]['content']['parts'][0]['inlineData']['data']
            mime = res['candidates'][0]['content']['parts'][0]['inlineData'].get('mimeType', '')
            return base64.b64decode(data), mime
        except urllib.error.HTTPError as e:
            last = f'HTTP {e.code}: {e.read()[:300]!r}'
            print(f'Gemini key failed ({e.code}); trying next key', file=sys.stderr)
            if e.code not in (400, 401, 403, 429, 500, 502, 503, 504):
                break
        except Exception as e:
            last = repr(e)
            print(f'Gemini request failed: {e}; trying next key', file=sys.stderr)
    raise SystemExit(f'Gemini TTS failed with every key: {last}')


def pcm_to_wav(path, data, mime):
    """Gemini 3.x returns a WAV file; older models return 16-bit mono PCM. Decode either to
    44.1 kHz mono float and write a WAV. Returns seconds."""
    import subprocess
    if data[:4] == b'RIFF':
        src = ['-i', 'pipe:0']
    else:
        m = re.search(r'rate=(\d+)', mime or '')
        src = ['-f', 's16le', '-ar', m.group(1) if m else '24000', '-ac', '1', '-i', 'pipe:0']
    raw = subprocess.run(['ffmpeg', '-v', 'error', *src, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'],
                         input=data, capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
    secs = len(x) / SR
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
    return secs


def whisper_words(wav_path):
    from faster_whisper import WhisperModel
    model = WhisperModel('base', device='cpu', compute_type='int8')
    with wave.open(str(wav_path), 'rb') as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768.0
        rate = w.getframerate()
    if rate != 16000:
        t = np.arange(len(x)) / rate
        x = np.interp(np.arange(0, len(x) * 16000 / rate) / 16000, t, x).astype(np.float32)
    segs, _ = model.transcribe(x, word_timestamps=True, language='en')
    words = []
    for s in segs:
        for w in (s.words or []):
            words.append({'w': w.word.strip(), 's': round(w.start, 3), 'e': round(w.end, 3)})
    return words


page_files = sorted(script_dir.glob('page*.txt'), key=lambda p: int(re.search(r'\d+', p.stem).group()))
if pages:
    page_files = [p for p in page_files if int(re.search(r'\d+', p.stem).group()) in pages]

import wave as wave_mod
qi = 0
if pages:  # keep global quote indexing when voicing a subset of pages
    all_pages = sorted(script_dir.glob('page*.txt'), key=lambda p: int(re.search(r'\d+', p.stem).group()))
    for pf in all_pages:
        if pf in page_files:
            break
        qi += len(QUOTE.findall(pf.read_text(encoding='utf-8')))
for pf in page_files:
    n = re.search(r'\d+', pf.stem).group()
    text = pf.read_text(encoding='utf-8')
    turns, qi = turns_of(text, qi)
    sig = hashlib.sha1(json.dumps([text, VOICES, MODEL, spec], sort_keys=True).encode()).hexdigest()[:12]
    wav = pub / f'voice_p{n}.wav'
    meta_p = out / f'voice_p{n}_meta.json'
    meta = json.loads(meta_p.read_text()) if meta_p.exists() else {}
    (out / f'turns_p{n}.json').write_text(json.dumps(
        [{'speaker': sp, 'style': st, 'text': t} for sp, t, st in turns], indent=1, ensure_ascii=False), encoding='utf-8')
    if meta.get('sig') == sig and wav.exists():
        print(f'page {n}: cached, skipping API')
    else:
        chars = sum(len(t) for _, t, _ in turns)
        print(f'page {n}: {len(turns)} turns, {chars} chars -> Gemini TTS')
        t0 = time.time()
        pcm, mime = tts(turns)
        secs = pcm_to_wav(wav, pcm, mime)
        meta_p.write_text(json.dumps({'sig': sig, 'secs': secs, 'model': MODEL, 'voices': VOICES}, indent=1))
        print(f'page {n}: {secs:.1f}s of audio in {time.time()-t0:.0f}s ({mime})')
if not pages and qi != len(QUOTE_TAGS):
    raise SystemExit(f'{slug}: {qi} quoted lines found but speakers.json lists {len(QUOTE_TAGS)}')

durs = {}
for pf in page_files:
    n = re.search(r'\d+', pf.stem).group()
    wav = pub / f'voice_p{n}.wav'
    if not wav.exists():
        raise SystemExit(f'page {n}: no wav produced')
    with wave_mod.open(str(wav), 'rb') as wh:
        durs[n] = wh.getnframes() / wh.getframerate()
    words_p = out / f'words_p{n}.json'
    if not words_p.exists():
        print(f'page {n}: whisper...')
        words_p.write_text(json.dumps(whisper_words(wav), ensure_ascii=False), encoding='utf-8')

all_words, acc = [], 0.0
for pf in page_files:
    n = re.search(r'\d+', pf.stem).group()
    ws = json.loads((out / f'words_p{n}.json').read_text(encoding='utf-8'))
    all_words += [{'w': w['w'], 's': round(w['s'] + acc, 3), 'e': round(w['e'] + acc, 3)} for w in ws]
    acc += durs[n]

# concatenate page wavs into voice.wav
chunks = []
for pf in page_files:
    n = re.search(r'\d+', pf.stem).group()
    with wave_mod.open(str(pub / f'voice_p{n}.wav'), 'rb') as w:
        chunks.append(np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float64) / 32768.0)
y = np.concatenate(chunks)
with wave_mod.open(str(pub / 'voice.wav'), 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())
(out / 'words.json').write_text(json.dumps(all_words, ensure_ascii=False), encoding='utf-8')
print(f'DONE {slug}: {len(page_files)} pages, {len(all_words)} words, {len(y)/SR:.1f}s total -> public/{slug}/voice.wav')
