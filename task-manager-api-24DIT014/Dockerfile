# Base image with Node.js 18
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy dependency definition files first for optimal layer caching
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose backend API port
EXPOSE 5000

# Start Express server
CMD ["node", "server.js"]
