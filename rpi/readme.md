# Raspberry Pi Setup

## SSH key

1. Create /home/pi/.ssh (700)
2. Copy SSH pub key to `~/.ssh/authorize_keys`

## Install rsync

```
$ sudo apt-get install rsync
```

## Run transmitter app on startup

https://raspberrypi.stackexchange.com/questions/8734/execute-script-on-start-up

1. Copy `systemd/transmitter.service` to `/lib/systemd/system/`
2. `$ sudo systemctl enable transmitter.service`

## Deploy to RPi

Copies `rpi` dir to `/home/pi/ff-voc/`

```
$ cd rpi && ./deploy
```
