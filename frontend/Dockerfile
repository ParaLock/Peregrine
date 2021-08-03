
FROM node:alpine

WORKDIR /app

COPY ./app/package.json /app/
COPY ./app/package-lock.json /app/

RUN npm install --legacy-peer-deps

#RUN chmod -R 777 /app
#RUN chmod 777 /app/node_modules/
#RUN chmod -R +x /app/node_modules/.bin/*

ENV PATH /app/node_modules/.bin:$PATH

CMD ["npm", "start"]