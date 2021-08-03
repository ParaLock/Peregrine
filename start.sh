#!bin/bash

if ! [ -x "$(command -v curl)" ]; then
    echo 'Error: Curl not found. Please install Curl and try again.'
    exit 1
fi

if ! [ -x "$(command -v docker-compose)" ]; then
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

docker-compose build
docker-compose up
