# Accelerometer example.
# Reads the accelerometer x, y, z values and prints them every tenth of a second.
# Open the serial port after running to see the output printed.
# Author: Tony DiCola
import time
import board
import adafruit_lis3dh
import simpleio

pwm = simpleio.Servo(board.A3)

# Uncomment _one_ of the hardware setups below depending on your wiring:

# Hardware I2C setup:
# import busio
# i2c = busio.I2C(board.SCL, board.SDA)
# lis3dh = adafruit_lis3dh.LIS3DH_I2C(i2c)

# Hardware I2C setup on CircuitPlayground Express:
import busio
i2c = busio.I2C(board.ACCELEROMETER_SCL, board.ACCELEROMETER_SDA)
lis3dh = adafruit_lis3dh.LIS3DH_I2C(i2c, address=0x19)

# Software I2C setup:
#import bitbangio
#i2c = bitbangio.I2C(board.SCL, board.SDA)
#lis3dh = adafruit_lis3dh.LIS3DH_I2C(i2c)

# Hardware SPI setup:
#import busio
#spi = busio.SPI(board.SCK, board.MOSI, board.MISO)
#cs = busio.DigitalInOut(board.D6)  # Set to appropriate CS pin!
#lis3dh = adafruit_lis3dh.LIS3DH_SPI(spi, cs)


# Set range of accelerometer (can be RANGE_2_G, RANGE_4_G, RANGE_8_G or RANGE_16_G).
lis3dh.range = adafruit_lis3dh.RANGE_2_G

while True:
    # Read accelerometer values (in m / s ^ 2).  Returns a 3-tuple of x, y,
    # z axis values.
    # x, y, z = lis3dh.acceleration
    # print('x = {}G, y = {}G, z = {}G'.format(x / 9.806, y / 9.806, z / 9.806))
    # print(lis3dh.acceleration)
    _x, _y, _z = lis3dh.acceleration
    x = _x / 9.806
    y = _y / 9.806
    z = _z / 9.806
    # print('x = {}G, y = {}G, z = {}G'.format(x, y, z))

    servo_middle = 67.5
    force = 70
    goal = -0.17
    error = y-goal
    P=250
    pwm.angle = max(0, min(180, servo_middle+error*P))
    # pwm.angle = servo_middle
    # if z < goal-sensitivity:
    #     pwm.angle = servo_middle-force
    # elif z > goal+sensitivity:
    #     pwm.angle = servo_middle+force
    # else:
    #     pwm.angle = servo_middle

    #time.sleep(0.1)
