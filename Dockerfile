# Use node 9.11.1
FROM node:9.11.1

# Update container
RUN apt-get update &&\
    apt-get install

# Add github to known hosts
RUN mkdir ~/.ssh && ln -s /run/secrets/host_ssh_key ~/.ssh/id_rsa && ssh-keyscan github.com >> ~/.ssh/known_hosts
RUN mkdir /database && touch /database/testdb.sqlite

# Change working directory
WORKDIR /app
