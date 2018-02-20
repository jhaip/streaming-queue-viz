import simpleio
import time
import board

pwm = simpleio.Servo(board.A3)
pwm2 = simpleio.Servo(board.A2)
pwm1_center = 67
pwm2_center = 58
pwm1_power = -8
pwm2_power = 5

while True:
    pwm.angle = pwm1_center + pwm1_power
    pwm2.angle = pwm2_center + pwm2_power
    time.sleep(1)
