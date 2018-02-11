import requests
import serial

REMOTE_URL = 'http://localhost:8002/'
PORT = '/dev/tty.usbmodem1411'  # ls /dev/tty.*
BAUD = 115200
input_stream = serial.Serial(PORT, BAUD)
print("STARTED")

while True:
    line = unicode(input_stream.readline())
    if line:
        msg = {'source': 'serial', 'value': line}
        print(msg)
        r = requests.post(REMOTE_URL, json=msg)
