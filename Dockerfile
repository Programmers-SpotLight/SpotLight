FROM node:18.20.2-alpine

WORKDIR /application
COPY . /application/

RUN ./sys.sh

WORKDIR /home/user/application
USER user