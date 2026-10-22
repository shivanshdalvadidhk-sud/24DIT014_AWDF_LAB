# Stage 1: Build React frontend application
FROM node:18 AS build

# Set working directory inside container
WORKDIR /app

# Copy dependency definition files
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy application source code
COPY . .

# Build production assets with Vite
RUN npm run build

# Expose frontend application port
EXPOSE 5173

# Serve production build using Vite preview bound to host
CMD ["npm", "run", "preview", "--", "--host"]
