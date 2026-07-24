FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy rest of the frontend source
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]