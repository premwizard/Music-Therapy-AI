import json
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

url = 'http://127.0.0.1:5000/recommend-multimodal'
payload = {'prompt': 'sad', 'num_songs': 5}
req = Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type':'application/json'})
try:
    with urlopen(req, timeout=10) as resp:
        body = resp.read().decode('utf-8')
        print('STATUS', resp.status)
        print('BODY', body)
except HTTPError as e:
    print('HTTP ERROR', e.code, e.read().decode('utf-8'))
except URLError as e:
    print('URL ERROR', e)
except Exception as e:
    print('ERR', e)
