## Setup

### Prepare the Raspberry Pi
- Download [Raspbian](https://www.raspberrypi.org/downloads/raspbian/)
- Flash Raspbian with [Etcher](https://etcher.io/)

### Enable SSH
> For headless setup, SSH can be enabled by placing a file named ssh, without any extension, onto the boot partition of the SD card. When the Pi # boots, it looks for the ssh file. If it is found, SSH is enabled, and the file is deleted. The content of the file does not matter: it could contain text, or nothing at all.

### Connect to the Internet / setup static IP

### Install docker
`curl -sSL get.docker.com | sh`

`sudo usermod -aG docker pi`

`sudo systemctl enable docker`

`sudo systemctl start docker`

`sudo pip install docker-compose`

### Create the udev rules 
`sudo nano  /etc/udev/rules.d/99-usb.rules`
```
KERNELS=="1-1.2", SUBSYSTEMS=="usb", SYMLINK+="1-1.2"
KERNELS=="1-1.2.1.1", SUBSYSTEMS=="usb", SYMLINK+="1-1.2.1.1"
```

### Create the data & project folder
`sudo mkdir /data/[lbox-computer-name]`

`sudo mkdir ~/lbox`

### Create the compose file
`nano docker-compose.yml`
```
version: "2.0"
services:
  lunchbox:
    image: lunchboxlambda/brain:[version]
    environment:
      - LBOX_COMPUTER_NAME=[lbox-computer-name]
      - PLATFORMIO_BOARD_ID=[lbox-board-id]
      - TZ=Europe/Stockholm
    devices:
      - /dev/1-1.2:/dev/controller
    ports:
      - 2280:80
    volumes:
      - /data/[lbox-computer-name]:/data
    restart: always
```

### Restart 
`sudo shutdown -r now`

### Spin up
`docker-compose up`
