import requests
import json

filepath = 'code.py'
code_list = []
with open(filepath) as fp:
    for cnt, line in enumerate(fp):
        code_list.append(line)
        # print("Line {}: {}".format(cnt, line))
    code_str = "".join(code_list)
    url = "http://localhost:8002/"
    payload = {'source': 'code', 'value': code_str}
    r = requests.post(url, json=payload)
    print r
