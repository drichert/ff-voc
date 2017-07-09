class Sensor:
  def __init__(self, spi_channel=0):
    self.spi_channel = spi_channel
    self.__load_spi()

  def value(self):
    r = spi.xfer([0XFF] * 4)
    return int.from_bytes(r[0:2], byteorder="big")

  # Returns class name (should be sensor name) suffixed with channel
  # number, e.g., "TG26202-0"
  def name(self):
    return self.__class__.__name__ + '-' + self.spi_channel

  def __load_spi(self):
    self.spi = spidev.SpiDev()
    self.spi(0, spi_channel)

class TG26202(Sensor): pass
