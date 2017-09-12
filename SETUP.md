# Setup

## Important

- **Do not** connect power until all sensors are connected to breakout
- All parts are hand-built and **FRAGILE**. Use caution and avoid
  applying pressure to ribbon cable or solder joints

## Hardware

### Parts

- 1 x Raspberry Pi (RPi) in clear case
- 1 x Sensor interface breakout box (gray aluminum box with numbered 3.5mm jacks)
- 4 x Sensors in white plastic cup enclosures with perforated lids
- 4 x 25ft 3.5mm TRS cables (to connect breakout box to sensors)
- 1 x Micro USB power adapter for Raspberry Pi
- 1 x 9V power supply ("1-spot") for breakout box

### Illustrations

| RPi & Breakout (front)              | RPi & Breakout (rear)                   | RPi & Breakout (top)                        | Sensors hung in tree                |
| ----------------------------------- | ----------------------------------- | ----------------------------------- | ----------------------------------- |
| ![](http://i.imgur.com/YMAdjaa.jpg) | ![](http://i.imgur.com/fvtO6Y2.jpg) | ![](http://i.imgur.com/BVNlfWf.jpg) | ![](http://i.imgur.com/w6It4Lr.jpg) |

### Instructions

1. Unpack Raspberry Pi and breakout box

    RPi and breakout box are set up together on a cardboard backing for stability.
    This can be located out of sight but within 25 feet of the plants we'll be
    monitoring, and with access to power and network connections.
    If located within an enclosure of some kind, be sure to leave adequate
    room for ventilation.

2. Connect sensors

    **Use caution.** Sensor connections and mountings are fragile.

    The sensor enclosures (white plastic cups) are numbered on top. Connect
    each sensor to the corresponding numbered input on the breakout box with
    one of the 25ft cables. You may need to gently squeeze the sides of the
    enclosure when connecting the cable.

3. Mount sensors

    Sensors should be hung on the plants as close the center or most
    foliage-dense part of the plant or group of plants. If the plant isn't
    sturdy enough to support the weight/size of the sensor, it can be hung
    from a stand or hanger placed as close to the most foliage-dense part of
    the plant(s) as possible.

    Tie a loop of string to the wingnut on top of the sensor enclosure to
    hang it. The opening of the enclosure cup should be facing downward with
    the perforated lid in place.

    **Make sure** there are no branches, leaves, or other parts of the plant
    poking into the sensor enclosure.

4. Network connection

    Connect ethernet cable from Raspberry Pi to router.

5. Power connections

    Connect the 9V power supply ("1-spot") to the power jack on the back of the
    breakout box. Connect the micro USB power adapter to the Raspberry Pi.


Once power is connected you should see the Raspberry Pi LEDs light up. You'll
also see the LEDs glow inside the enclosures while the sensors warm up. The
system will auto-start once the Raspberry Pi is turned on.

### Testing

#### Tools needed

- Sharpie (or similar permanent marker)

#### Instructions

Permanent markers give off a high concentration of volatile organic compounds.
Each sensor should generate a clear value spike when exposed to Sharpie fumes.
We'll use this to test all 4 sensors.

For each of the 4 sensors:

1. Note the current time
2. Uncap the marker and hold it a couple inches underneath the sensor enclosure
   for about 20 seconds

Once this is done for all 4 sensors, send me the times and corresponding
sensor numbers.

## Software (remote access)

### Tools needed

- A monitor or TV with HDMI input (only used during setup, won't be used
  for the installation itself)
- A USB keyboard

### Instructions

1. Take note of your [router's IP address](https://www.howtogeek.com/233952/how-to-find-your-routers-ip-address-on-any-computer-smartphone-or-tablet/).

2. Log in to your router's admin interface determine the IP assigned to the
  Raspberry Pi. How you access that info will vary depending on the router,
  check the manual or google router make/model number for more info.

3. Connect an HDMI monitor/TV and a USB keyboard to the Rasbperry Pi

4. Open `/etc/dhcpcd.conf` using nano (vi is also installed)

        $ sudo nano /etc/dhcpcd.conf

5. Use the down arrow key to move to the bottom of the file. You should see a
  section that looks like this:

        ## Trondheim network configuration
        #interface eth0
        #static ip_address=192.168.0.222/24
        #static routers=192.168.0.1
        #static domain_name_servers=192.168.0.1

    Delete the first '#' character for each of these lines to change them to
    look like the following:

        # Trondheim network configuration
        interface eth0
        static ip_address=192.168.0.222/24
        static routers=192.168.0.1
        static domain_name_servers=192.168.0.1

    ('#' at the beginning of a line indicates a comment, so removing them
    enables the configuratiotn setting for that line)

6. Adjust configuration to match local network settings.

    In the configuration above, the router is set up at 192.168.0.1 and we
    give the Raspberry Pi the IP 192.168.0.222. Note that `routers` and
    `domain_name_servers` settings should have the same value.

    If, for example, the router IP turns out to be 192.168.99.33, we would
    use a configuration like this instead:

        interface eth0
        static ip_address=192.168.99.222/24
        static routers=192.168.99.33
        static domain_name_servers=192.168.99.33

7. Save the file by pressing **Ctrl+o** then hit Enter to confirm file name.
  Then press **Ctrl+x** to exit nano.

8. Reboot the Raspberry PI

        $ sudo reboot

9. Once the Raspbery Pi has rebooted, go to your router's admin interface and
  you should see the Raspberry Pi connected with the newly assigned static
  IP (ending in ".222")

10. In your router's admin interface, set up port forwarding for port 22 (SSH)
  to the static IP. This will allow remote SSH connections to the Raspberry Pi.

11. Test SSH connection

    1. Contact me to get the password for the Raspberry Pi user
    2. Get the network's external IP from http://www.whatsmyip.org/
    3. In a Terminal on your machine (assuming Mac/Linux) run

            $ ssh pi@12.34.56.78

        (replacing '12.34.56.78' with the external IP of the network)

    If everything went according to plan, you should now be logged in via
    SSH. Type `exit` and hit Enter to log out.

