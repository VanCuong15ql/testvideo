import json
tl = json.load(open('src/episodes/sandglass/timeline.json', encoding='utf-8'))
for s in tl['shots']:
    flag = ' <-- key > len' if s['key'] > s['len'] else ''
    print(f"{s['id']:4} len {s['len']:4} key {s['key']:4}{flag}")
print('total', tl['total'], 'audio', tl.get('audio'))
