import spidev
import time
import boto3
import json

with open("config.json") as f:
  config = json.load(f)

#db_client = boto3.client('dynamodb',
#  region_name="us-east-2",
#  aws_access_key_id="ABCDEFGHIJJ",
#  aws_secret_access_key="asdfasdfasdfasdf"
#)
db_client = boto3.client('dynamodb',
  region_name=config["region"],
  aws_access_key_id=config["aws_access_key_id"],
  aws_secret_access_key=config["aws_secret_access_key"]
)

spi = spidev.SpiDev()
spi.open(0, 0)

def readadc():
  r = spi.xfer([0xFF] * 4)

  return int.from_bytes(r[0:2], byteorder='big')

while True:
  timestamp_ms = int(time.time() * 1000)

  item = {
    "sensor": { "S": "TGS2602" },
    "ms": { "S": str(timestamp_ms) },
    "value": { "S": str(readadc()) }
  }

  print(item)

  db_client.put_item(TableName="sensor-test-5", Item=item)

  time.sleep(0.333)
