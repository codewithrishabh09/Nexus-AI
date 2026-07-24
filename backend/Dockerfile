FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy rest of the backend source
COPY . .

EXPOSE 5000

CMD ["npm", "start"]