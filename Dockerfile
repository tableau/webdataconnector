FROM node:10.14-alpine

COPY . /webdataconnector
WORKDIR /webdataconnector

RUN apk --no-cache add ca-certificates git

RUN npm install --production

CMD ["npm", "start"]