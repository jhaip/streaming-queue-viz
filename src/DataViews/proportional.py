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
    error = distance - GOAL_DISTANCE
    P = 1.0 / 4000.0
    base_speed = 1.0
    motor_left_value = base_speed - error * P
    motor_right_value = base_speed + error * P
    motor_left_value = max(0, min(motor_left_value, 180))
    motor_right_value = max(0, min(motor_right_value, 180))
    print("%d, %f".format(distance, error * P))
    motor_left.angle = motor_left_center + motor_left_power * motor_left_value
    motor_right.angle = motor_right_center + motor_right_power * motor_right_value
    time.sleep(0.2)
