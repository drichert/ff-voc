# Raspberry Pi Setup

## Passwordless pub key SSH access

1. Create /home/pi/.ssh (700)
2. Copy SSH pub key to `~/.ssh/authorize_keys`

## Install deps

```
$ sudo apt-get install rsync dnsutils
```

## Run transmitter app on startup

1. Copy `systemd/transmitter.service` to `/lib/systemd/system/`
2. `$ sudo systemctl enable transmitter.service`

## Deploy to RPi

Copies `rpi` dir to `/home/pi/ff-voc/` (replace IP with RPi IP)

```
$ cd rpi && ./deploy 192.168.0.103
```
