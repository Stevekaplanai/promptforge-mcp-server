FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all source files
COPY . .

# Expose port (important for container networking)
EXPOSE 8000

# Use the minimal server for now
CMD ["node", "smithery-minimal.js"]