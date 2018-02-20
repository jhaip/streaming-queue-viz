import simpleio
import time
import board

pwm = simpleio.Servo(board.A2)

while True:
    pwm.angle = 70
    time.sleep(1)
