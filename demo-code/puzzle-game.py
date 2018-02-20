# Accelerometer example.
# Reads the accelerometer x, y, z values and prints them every tenth of a second.
# Open the serial port after running to see the output printed.
# Author: Tony DiCola
import time
import board
import adafruit_lis3dh
import neopixel

pixels = neopixel.NeoPixel(board.NEOPIXEL, 10, auto_write=0, brightness=.05)
pixels.fill((0,0,0))
pixels.show()

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

recent_codes = []
PASSCODE = ["Z UP", "X UP", "Z UP", "X DOWN", "Z UP"]
STATE_TO_COLOR = {
    "X UP": (100, 0, 0),
    "X DOWN": (100, 100, 0),
    "Y UP": (0, 100, 0),
    "Y DOWN": (0, 50, 100),
    "Z UP": (0, 0, 100),
    "Z DOWN": (100, 0, 100),
}
PASSCODE_COLOR = (0, 255, 0)

def accel_to_state(acceleration):
    _x, _y, _z = acceleration
    x = _x / 9.806
    y = _y / 9.806
    z = _z / 9.806
    # print('x = {}G, y = {}G, z = {}G'.format(x, y, z)

    if (x + y + z) > 1.5:
        return "IN BETWEEN"
    if x > 0.9:
        return "X UP"
    if x < -0.9:
        return "X DOWN"
    if y > 0.9:
        return "Y UP"
    if y < -0.9:
        return "Y DOWN"
    if z > 0.9:
        return "Z UP"
    if z < -0.9:
        return "Z DOWN"
    return "IN BETWEEN"

# Loop forever printing accelerometer values
i = 0
while True:
    # Read accelerometer values (in m / s ^ 2).  Returns a 3-tuple of x, y,
    # z axis values.
    # x, y, z = lis3dh.acceleration
    # print('x = {}G, y = {}G, z = {}G'.format(x / 9.806, y / 9.806, z / 9.806))
    print(lis3dh.acceleration)
    code = accel_to_state(lis3dh.acceleration)
    # print(code)
    if code != "IN BETWEEN" and (len(recent_codes) == 0 or recent_codes[-1] != code):
        recent_codes.append(code)
        if len(recent_codes) > 5:
            recent_codes.pop(0)
    # print(recent_codes)

    if recent_codes == PASSCODE:
        # print("UNLOCKED!")
        pixels.fill(PASSCODE_COLOR)
        pixels.show()
        time.sleep(0.1)
        pixels.fill((0,0,0))
        pixels.show()
        time.sleep(0.1)
    elif code != "IN BETWEEN":
        pixels.fill(STATE_TO_COLOR[code])
        pixels.show()
    # Small delay to keep things responsive but give time for interrupt processing.
    time.sleep(0.5)
    # i += 1
    # print(i % 10)
