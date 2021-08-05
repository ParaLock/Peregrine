
FROM node:alpine

WORKDIR /app

COPY --chown=node:users ./app/package.json /app/

RUN npm install --legacy-peer-deps
RUN npm update --legacy-peer-deps

ENV PATH /app/node_modules/.bin:$PATH

CMD ["npm", "start"]