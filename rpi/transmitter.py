class Transmitter:
  # sensors - List of Sensor objects
  def __init__(self, sensors):
    self.sensors = sensors

    self.__load_config()
    self.__load_db_client()

  # Transmit all sensor values
  def transmit(self):
    self.timestamp = self.__timestamp_ms()

    for sensor in sensors:
      self.sensor = sensor
      self.__transmit_sensor_value()

  def __transmit_sensor_value(self):
    self.db_client.put_item(
      TableName=self.config["table"],
      Item=self.__payload()
    )

  def __payload(self, sensor):
    return {
      "sensor": { "S": self.sensor.name() },
      "timestamp": { "N": self.timestamp },
      "value": { "N": self.sensor.value() }
    }

  def __timestamp_ms(self):
    return int(time.time() * 1000)

  def __load_config(self):
    with open("config.json") as f:
      self.config = json.load(f)

  def __load_db_client(self):
    self.db_client = boto3.client("dynamodb",
      region_name=self.config["region"],
      aws_access_key_id=self.config["aws_access_key_id"],
      aws_secret_access_key=self.config["aws_secret_access_key"]
    )
