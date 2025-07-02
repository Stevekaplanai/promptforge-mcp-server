FROM node:18-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port for HTTP transport
EXPOSE 8000

# Start the server
CMD ["node", "server.js"]