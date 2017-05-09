import spidev
import time
import boto3

db_client = boto3.client('dynamodb',
  region_name="us-east-2",
  aws_access_key_id="ABCDEFGHIJJ",
  aws_secret_access_key="asdfasdfasdfasdf"
)

spi = spidev.SpiDev()
spi.open(0, 0)

def readadc():
  r = spi.xfer([0xFF] * 4)

  return int.from_bytes(r[0:2], byteorder='big')

while True:
  timestamp_ms = int(time.time() * 1000)

  item = {
    "timestamp": { "N": str(timestamp_ms) },
    "value": { "N": str(readadc()) }
  }

  print(item)

  db_client.put_item(TableName="sensor-test", Item=item)

  time.sleep(0.333)
