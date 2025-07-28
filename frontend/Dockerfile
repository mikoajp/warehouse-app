FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN if [ -f "package.json" ]; then npm ci; fi

COPY . .

EXPOSE 3000

CMD ["npm", "start"]