# FROM pptr/image:stable

# WORKDIR /app
# COPY package.json /app/
# RUN npm install
# COPY . /app/

# CMD ["node", "index.js"]


FROM node:lts as builder
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:lts-slim
ENV NODE_ENV production
USER node
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm ci --production
COPY --from=builder /usr/src/app/dist ./dist
# EXPOSE 8080
CMD [ "node", "dist/index.js" ]


//TODO: сделать пр примеру https://www.emmanuelgautier.com/blog/snippets/typescript-dockerfile