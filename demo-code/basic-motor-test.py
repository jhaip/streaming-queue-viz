import simpleio
import time
import board

pwm = simpleio.Servo(board.A3)

while True:
    pwm.angle = 30
    print("Angle: ", pwm.angle)
    time.sleep(0.1)
    pwm.angle = 150
    print("Angle: ", pwm.angle)
    time.sleep(0.1)
