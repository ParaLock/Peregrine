FROM node:14

WORKDIR /app

COPY ./app/package.json /app/

RUN npm install 
RUN npm update 

EXPOSE 8080
CMD [ "node", "src/server.js" ]
