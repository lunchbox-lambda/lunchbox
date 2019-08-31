FROM balenalib/raspberrypi3-node:10.16.0-stretch-build

RUN apt-get update && apt-get install -y \
    fswebcam \
    git \
    python-pip \
    python-setuptools

RUN pip install -U pip

RUN pip install -U \
    platformio==3.6.7



###################### Platform IO ############################

WORKDIR /platformio

RUN platformio init -d .
RUN platformio lib install https://github.com/lunchbox-lambda/firmata.git#1.0.0
RUN rm -rf /platformio/src && ln -s /platformio/.piolibdeps/LunchboxFirmata/src /platformio



####################### Application ###########################

ARG BUILD_VERSION

WORKDIR /app

ENV NODE_ENV=production
ENV NODE_PATH=/app/brain/dist

COPY */*.tgz package.json yarn.lock ./

RUN tar zxf lunchbox-lambda-brain-v1.0.0.tgz && mv package brain && \
    tar zxf lunchbox-lambda-client-v1.0.0.tgz && mv package client && \
    tar zxf lunchbox-lambda-frontend-v1.0.0.tgz && mv package frontend && \
    tar zxf lunchbox-lambda-node-red-v1.0.0.tgz && mv package node-red && \
    tar zxf node-red-contrib-lunchbox-v1.0.0.tgz && mv package node-red-contrib

RUN rm *.tgz

RUN yarn install --frozen-lockfile

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
