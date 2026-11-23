import sys
sys.path.insert(0, '../scripts')
import json, urllib.request, urllib.error
from wi import api_keys

for i, k in enumerate(api_keys(), 1):
    req = urllib.request.Request('https://api.elevenlabs.io/v1/user/subscription', headers={'xi-api-key': k})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            s = json.loads(r.read())
        print(f'key {i}: OK, used {s["character_count"]} of {s["character_limit"]}, left {s["character_limit"] - s["character_count"]}')
    except urllib.error.HTTPError as e:
        print(f'key {i}: HTTP {e.code}')
    except Exception as e:
        print(f'key {i}: {type(e).__name__}')
