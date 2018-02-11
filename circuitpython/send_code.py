import requests
import sys

if len(sys.argv) is not 4:
    print("3 command line arguments expected")

watch_event_type = sys.argv[1]
watch_src_path = sys.argv[2]
watch_dest_path = sys.argv[3]
filepath = watch_src_path
if watch_event_type == "moved":
    filepath = watch_dest_path
code_list = []
print("Opening code file")
print(filepath)
with open(filepath) as fp:
    for cnt, line in enumerate(fp):
        code_list.append(line)
        # print("Line {}: {}".format(cnt, line))
    code_str = "".join(code_list)
    print(code_str)
    url = "http://localhost:8002/"
    payload = {'source': 'code', 'value': code_str}
    r = requests.post(url, json=payload)
    print r
