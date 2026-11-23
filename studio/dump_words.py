import json, sys
w = json.load(open('src/episodes/sandglass/words.json', encoding='utf-8'))
lines = [f"{i}\t{x['s']:.2f}\t{x['w']}{x['p']}" for i, x in enumerate(w)]
open('out/sandglass/words.txt', 'w', encoding='utf-8').write('\n'.join(lines))
print(len(w))
