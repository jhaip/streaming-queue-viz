from analogio import AnalogIn
import simpleio
import time
import board

analogin = AnalogIn(board.A1)
GOAL_DISTANCE = 48000
motor_left = simpleio.Servo(board.A3)
motor_right = simpleio.Servo(board.A2)
motor_left_center = 67
motor_right_center = 58
motor_left_power = -8
motor_right_power = 5

while True:
    distance = analogin.value
    print(distance)
    motor_left_value = 0
    motor_right_value = 0
    if distance - GOAL_DISTANCE > 0:
        # too far away, turn towards the wall
        motor_left_value = 0.5
        motor_right_value = 1.5
    else:
        # too close, turn away from the wall
        motor_left_value = 1.5
        motor_right_value = 0.5
    motor_left.angle = motor_left_center + motor_left_power * motor_left_value
    motor_right.angle = motor_right_center + motor_right_power * motor_right_value
    time.sleep(0.2)
