FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (not just production)
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Start server
CMD ["node", "smithery-final.js"]