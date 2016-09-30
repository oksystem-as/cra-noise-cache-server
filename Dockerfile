FROM node:slim

RUN mkdir -p /usr/src/iot-lora-cra-cache
WORKDIR /usr/src/iot-lora-cra-cache

RUN ls -l
COPY ./ /usr/src/iot-lora-cra-cache
RUN rm Dockerfile
RUN ls -l

RUN npm install --production

EXPOSE 8080
CMD [ "npm", "start" ]