FROM node:argon

RUN mkdir -p /usr/src/iot-lora-cra-cache
WORKDIR /usr/src/iot-lora-cra-cache

COPY . /usr/src/iot-lora-cra-cache
RUN ls -l

RUN npm install \
    npm run typings install
RUN npm run grunt

EXPOSE 8080
CMD [ "npm", "start" ]