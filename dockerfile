FROM alpine:latest

# FROM node:18-alpine

# Set the timezone to Hong Kong
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Hong_Kong /etc/localtime && \
    echo "Asia/Hong_Kong" > /etc/timezone && \
    apk del tzdata

# Update APK and install essential packages in a single step
RUN apk update && \
    apk add --no-cache nodejs npm

# Create necessary directories before Nginx installation
# RUN mkdir -p /run/nginx

# Copy the default nginx config with CORS enabled
# COPY default.conf /etc/nginx/http.d
# RUN sed -i 's/listen ${PORT:-80};/listen 80;/g' /etc/nginx/http.d/default.conf

# Set the working directory inside the container
WORKDIR /app

# Copy your application files into the container
COPY . /app

# Install application dependencies
RUN npm install

# Expose necessary ports
EXPOSE 3001

COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Set the command to execute the start script
CMD ["/usr/local/bin/start.sh"]