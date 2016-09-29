FROM node:argon

RUN mkdir -p /usr/src/iot-lora-cra-cache
WORKDIR /usr/src/iot-lora-cra-cache

COPY ./bin /usr/src/iot-lora-cra-cache
COPY ./docs /usr/src/iot-lora-cra-cache
COPY ./config.yaml /usr/src/iot-lora-cra-cache
COPY ./package.json /usr/src/iot-lora-cra-cache
COPY ./dist /usr/src/iot-lora-cra-cache
RUN ls -l

RUN npm install --production

EXPOSE 8080
CMD [ "npm", "start" ]