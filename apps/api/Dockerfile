FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --ignore-engines

# Copy source code
COPY . .

# Expose port (your app uses 5000 or 8080)
EXPOSE 5000

# Start the application
CMD ["yarn", "start"]