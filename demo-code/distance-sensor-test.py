from analogio import AnalogIn
import board
import time

analogin = AnalogIn(board.A1)

while True:
    # print("Analog Voltage: %d" % analogin.value)
    print(analogin.value)
    time.sleep(0.1)
