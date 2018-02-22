import requests
import serial
import sys

if len(sys.argv) is not 3:
    print("Expected 2 arguments:  1. serial port path  2. serial baud rate")
    print("")
    print("Example:")
    print("    python serial_logger.py \"/dev/tty.usbmodem1411\" 115200")
    print("")
    print("on Mac you can use \"ls /dev/tty.*\" to find the serial path")
    sys.exit()

REMOTE_URL = 'http://localhost:8002/'
PORT = sys.argv[1]
BAUD = sys.argv[2]
input_stream = serial.Serial(PORT, BAUD)
print("STARTED")

while True:
    line = unicode(input_stream.readline())
    if line:
        msg = {'source': 'serial', 'value': line}
        print(msg)
        r = requests.post(REMOTE_URL, json=msg)
