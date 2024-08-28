FROM node:22.7-alpine

WORKDIR /application
COPY . /application/

RUN ./sys.sh

WORKDIR /home/user/application
USER user