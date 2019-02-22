FROM node:10.12.0-jessie
# https://github.com/Yelp/dumb-init
RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64
RUN chmod +x /usr/local/bin/dumb-init
RUN mkdir -p /app
WORKDIR /app
ADD . /app/
RUN npm install
# CMD ["/usr/local/bin/dumb-init", "npm", "run", "start"]
