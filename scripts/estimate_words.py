"""Offline stand-in for voice.py's word timings, so plan.py and the storyboard can run without an API key.

python <skill>/scripts/estimate_words.py <slug> [--rate 0.27]
Reads  src/episodes/<slug>/episode.json  (script, gaps)
Writes src/episodes/<slug>/words.json  (same shape voice.py writes: w, s, e, p)
When the ElevenLabs key is available, run voice.py and it overwrites this file with the real timings.
"""
import re
import sys

from wi import ep_dir, load_episode, save_json

slug = sys.argv[1]
rate = 0.27
if '--rate' in sys.argv:
    rate = float(sys.argv[sys.argv.index('--rate') + 1])

ep = load_episode(slug)
text = ' '.join(b['text'].strip() for b in ep['script'])
G = {'word': 0.07, 'comma': 0.18, 'sentence': 0.26, 'question': 0.34, 'pairs': {}}
G.update(ep.get('gaps', {}))

# split exactly the way voice.py does: a word is a run of word characters (Unicode, so Vietnamese survives),
# and punctuation after it is kept on the word so its pause can be decided
words, cur = [], None
for ch in text:
    if re.match(r"[\w'’]", ch):
        if cur is None:
            cur = {'w': '', 's': 0.0, 'e': 0.0, 'p': ''}
        cur['w'] += ch
    else:
        if cur is not None:
            words.append(cur)
            cur = None
        if words and ch.strip():
            words[-1]['p'] += ch
if cur:
    words.append(cur)

t = 0.15  # a little air before the first word, as the voice has
for i, w in enumerate(words):
    n = len(w['w'])
    dur = max(0.16, min(0.62, 0.10 + 0.042 * n)) * (rate / 0.27)
    w['s'] = round(t, 3)
    t += dur
    w['e'] = round(t, 3)
    p = w['p']
    if '?' in p or '!' in p:
        gap = G['question']
    elif '.' in p or ':' in p or ';' in p or '…' in p:
        gap = G['sentence']
    elif ',' in p or '—' in p or '-' in p:
        gap = G['comma']
    else:
        gap = G['word']
    t += gap

save_json(ep_dir(slug) / 'words.json', words)
print(f'{len(words)} words, {t:.1f} s estimated ({t / 60:.1f} min) at {rate:.2f} s/word base')
