import spidev
import time
import boto3
import json

from sensors import *
from transmitter import Transmitter

with open("config.json") as f:
  config = json.load(f)

while True:
  Transmitter([
    TG26202(0),
    TG26202(1)
  ])#.transmit()

  time.sleep(0.333)
