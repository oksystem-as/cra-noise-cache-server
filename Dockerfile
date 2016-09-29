FROM node:argon

RUN mkdir -p /usr/src/iot-lora-cra-cache
WORKDIR /usr/src/iot-lora-cra-cache

RUN npm install typings --global

COPY . /usr/src/iot-lora-cra-cache
RUN ls -l

RUN npm install \
    typings install
RUN npm run grunt

EXPOSE 8080
CMD [ "npm", "start" ]