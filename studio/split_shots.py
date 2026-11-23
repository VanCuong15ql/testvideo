import json, pathlib

p = pathlib.Path('src/episodes/sandglass/episode.json')
ep = json.loads(p.read_text(encoding='utf-8'))

new_shots = {
    'S1b': {'id': 'S1b', 'size': 'insert, window', 'set': 'workshop (window)', 'key': 50, 'note': "rain on the window; the shop's reflection in it"},
    'S2b': {'id': 'S2b', 'size': 'insert, shelf', 'set': 'workshop (shelf)', 'key': 60, 'note': "the shelf: a photograph of ông Ba, the old keeper"},
    'S8b': {'id': 'S8b', 'size': 'macro', 'set': 'workshop (bench)', 'key': 60, 'note': "his hands on the object; the memory is what he keeps"},
    'S13b': {'id': 'S13b', 'size': 'extreme close-up', 'set': 'workshop (bench)', 'key': 90, 'note': "the hairline crack, light bending in it"},
    'S18b': {'id': 'S18b', 'size': 'extreme close-up', 'set': 'workshop (bench)', 'key': 80, 'note': "caked sand stuck to the inside of the glass"},
    'S22b': {'id': 'S22b', 'size': 'insert', 'set': 'workshop (worktop)', 'key': 60, 'note': "the white dish and the tools; dry it, sift it, pour it back"},
    'S25b': {'id': 'S25b', 'size': 'insert, warm', 'set': 'workshop (bench)', 'key': 70, 'note': "her hands around the hourglass; the memory of the gift"},
    'S34b': {'id': 'S34b', 'size': 'insert, window', 'set': 'workshop (window)', 'key': 80, 'note': "rain on the window; his voice even as the rain"},
    'S45b': {'id': 'S45b', 'size': 'insert', 'set': 'workshop', 'key': 50, 'note': "dust in the lamp light; the room slows"},
    'S57b': {'id': 'S57b', 'size': 'macro', 'set': 'workshop (bench)', 'key': 110, 'note': "the mound growing, grain by grain"},
    'S68b': {'id': 'S68b', 'size': 'insert, window', 'set': 'workshop (window)', 'key': 80, 'note': "the wet street through the glass; rain"},
    'S76b': {'id': 'S76b', 'size': 'macro', 'set': 'workshop (bench)', 'key': 90, 'note': "the empty hourglass on the bench; rain outside"},
}

# insert each new shot right after its parent
shots = []
for s in ep['shots']:
    shots.append(s)
    if s['id'] in new_shots:
        shots.append(new_shots[s['id']])
ep['shots'] = shots

inserts = {
    'S1': ('S1b', 'có'),
    'S2': ('S2b', 'mất'),
    'S8': ('S8b', 'mà'),
    'S13': ('S13b', 'nhưng'),
    'S18': ('S18b', 'những'),
    'S22': ('S22b', 'lọc'),
    'S25': ('S25b', 'cứ'),
    'S34': ('S34b', 'giọng'),
    'S45': ('S45b', 'mọi'),
    'S57': ('S57b', 'rơi'),
    'S68': ('S68b', 'mang'),
    'S76': ('S76b', 'giống'),
}

edit = []
for e in ep['edit']:
    edit.append(e)
    if e['shot'] in inserts:
        sid, at = inserts[e['shot']]
        edit.append({'shot': sid, 'at': at})
ep['edit'] = edit

for s in ep['shots']:
    if s['id'] == 'S72':
        s['key'] = 40

p.write_text(json.dumps(ep, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print(len(ep['shots']), 'shots,', len(ep['edit']), 'edit entries')
