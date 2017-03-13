# Use latest version of Node as the base image
FROM node:7.5.0

# Set work directory for run/cmd 
WORKDIR /app

# Build variable for setting app environment
# ARG Q_SERVER_BASE_URL
# ENV Q_SERVER_BASE_URL ${Q_SERVER_BASE_URL}

# ARG DEV_LOGGING
# ENV DEV_LOGGING ${DEV_LOGGING}

# ARG PUSH_STATE
# ENV PUSH_STATE ${PUSH_STATE}

# ARG IS_PLAYGROUND_INSTANCE
# ENV IS_PLAYGROUND_INSTANCE ${IS_PLAYGROUND_INSTANCE}

# Copy everything else to work directory
COPY ./package.json /app
COPY ./node_modules /app/node_modules
COPY ./LICENSE /app

COPY ./index.js /app
COPY ./server.js /app
COPY ./routes /app/routes

COPY ./client/favicon.png /app/client/favicon.png
COPY ./client/favicon-playground.png /app/client/favicon-playground.png

COPY ./client/locales /app/client/locales

COPY ./client/export /app/client/export

# Run node app with env variable
CMD npm run start
