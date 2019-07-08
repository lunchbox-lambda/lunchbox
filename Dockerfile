FROM balenalib/raspberrypi3-node:10.16.0-stretch-build

RUN apt-get update && apt-get install -y \
    fswebcam \
    git \
    python-pip \
    python-setuptools

RUN pip install -U pip

RUN pip install -U \
    platformio 



###################### Platform IO ############################

WORKDIR /platformio

RUN platformio init -d .
RUN platformio lib install https://github.com/lunchbox-lambda/firmata.git#1.0.0
RUN rm -rf /platformio/src && ln -s /platformio/.piolibdeps/LunchboxFirmata/src /platformio



####################### Application ###########################

ARG BUILD_VERSION

WORKDIR /app

COPY brain/dist brain/dist/
COPY brain/package.json brain/
COPY client/dist client/dist/
COPY client/package.json client/
COPY frontend/dist frontend/dist/
COPY frontend/package.json frontend/
COPY node-red node-red/
COPY node-red-contrib node-red-contrib/
COPY package.json yarn.lock ./

ENV NODE_ENV=production
ENV NODE_PATH=/app/brain/dist
RUN yarn install

VOLUME /data

EXPOSE 80



################### Environment & Startup ######################

WORKDIR /

ENV LBOX_VERSION=${BUILD_VERSION}
ENV DEBUG="backend:*, firmware:*, kernel:*, webapi:*, lib:*, service:*"

RUN echo "#!/bin/bash" >> /start.sh && \
    echo "node /app/brain |& tee /data/stdout.log" >> /start.sh

RUN chmod 755 /start.sh

CMD /start.sh
