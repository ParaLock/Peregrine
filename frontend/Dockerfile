#Credit: https://www.pluralsight.com/guides/using-react.js-with-docker

# pull the base image
FROM node:alpine

# set the working direction
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY app/package.json ./

#RUN npm install

# start app
CMD ["npm", "start"]