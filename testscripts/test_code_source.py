from analogio import AnalogIn
import board
import time

analogin = AnalogIn(board.A1)

while True:
    print(analogin.value)
    time.sleep(0.1)
