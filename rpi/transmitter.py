import spidev
import time
import boto3
import json
import Adafruit_GPIO.SPI as SPI
import Adafruit_MCP3008

with open("config.json") as f:
  config = json.load(f)

db_client = boto3.client('dynamodb',
  region_name=config["region"],
  aws_access_key_id=config["aws_access_key_id"],
  aws_secret_access_key=config["aws_secret_access_key"]
)

spi = spidev.SpiDev()
spi.open(0, 0)

SPI_PORT = 0
SPI_DEVICE = 0
NUM_SENSORS = 4

adc = Adafruit_MCP3008.MCP3008(
  spi=SPI.SpiDev(SPI_PORT, SPI_DEVICE))

while True:
  timestamp_ms = int(time.time() * 1000)
  values = [0] * NUM_SENSORS

  for i in range(NUM_SENSORS):
    v = values[i] = adc.read_adc(i)

    db_item = {
      "sensor": { "N": str(i + 1) },
      "timestamp": { "N": str(timestamp_ms) },
      "value": { "N": str(v) }
    }

    db_client.put_item(TableName=config["table"], Item=db_item)

  print(values)

  time.sleep(1)
