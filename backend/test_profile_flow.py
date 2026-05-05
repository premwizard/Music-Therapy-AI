import requests

base = 'http://127.0.0.1:5000'

print('Registering test user...')
r = requests.post(base+'/register', json={'username':'testuser','password':'testpass','meta':{'displayName':'Tester','bio':'I love music'}})
print(r.status_code, r.text)
print('Getting profile...')
r = requests.get(base+'/profile', params={'token':'testuser'})
print(r.status_code, r.text)

print('Updating profile...')
r = requests.post(base+'/profile', json={'meta':{'displayName':'Tester2','bio':'Updated bio'}}, headers={'Authorization':'testuser'})
print(r.status_code, r.text)
print('Getting profile after update...')
r = requests.get(base+'/profile', params={'token':'testuser'})
print(r.status_code, r.text)
