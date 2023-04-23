FROM node:slim AS app

WORKDIR /app
COPY package*.json ./
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm install

FROM app as build
COPY . .
RUN npm run build

FROM app
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package*.json ./
CMD ["npm", "start"]
