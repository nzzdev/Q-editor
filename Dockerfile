# Use latest version of Node as the base image
FROM node:10

# Set work directory for run/cmd
WORKDIR /app

# Copy everything else to work directory
COPY ./package.json /app
COPY ./package-lock.json /app
RUN npm install --production

COPY ./LICENSE /app

COPY ./index.js /app
COPY ./routes /app/routes

COPY ./client/favicon.png /app/client/favicon.png
COPY ./client/favicon-playground.png /app/client/favicon-playground.png

COPY ./client/locales /app/client/locales

COPY ./client/export /app/client/export

# Copy the jspm_packages as there are some modules that are not loaded from a bundle
COPY ./client/jspm_packages /app/client/export/jspm_packages

# Run node app with env variable
CMD npm run start
