import time
import Adafruit_GPIO.SPI as SPI
import Adafruit_MCP3008

SPI_PORT = 0
SPI_DEVICE = 0
NUM_SENSORS = 4

adc = Adafruit_MCP3008.MCP3008(
  spi=SPI.SpiDev(SPI_PORT, SPI_DEVICE))

while True:
  timestamp_ms  = int(time.time() * 1000)
  values = [0] * NUM_SENSORS

  for i in range(NUM_SENSORS):
    values[i] = adc.read_adc(i)

    item = {
        "sensor": { "N": i + 1 },
        "timestamp": { "N": timestamp_ms },
        "value": { "N": values[i] }
    }

    db_client.put_item(TableName=config["table"], Item=item)

  print(values)

  time.sleep(0.33)
