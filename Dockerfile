FROM node:10-alpine as builder
# Set the working directory to /app
WORKDIR /nebula-benchmark-stat
# Copy the current directory contents into the container at /app
COPY package.json /nebula-benchmark-stat/
COPY .npmrc /nebula-benchmark-stat/
# Install any needed packages
RUN npm install
COPY . /nebula-benchmark-stat/

# build and remove front source code
RUN npm run build && npm run tsc && rm -rf app/assets/*
COPY ./app/assets/index.html  /nebula-benchmark-stat/app/assets/

FROM node:10-alpine
 # Make port available to the world outside this container

WORKDIR /nebula-benchmark-stat
COPY --from=builder ./nebula-benchmark-stat/package.json /nebula-benchmark-stat/
COPY .npmrc /nebula-benchmark-stat/
COPY --from=builder /nebula-benchmark-stat/app /nebula-benchmark-stat/app
COPY --from=builder /nebula-benchmark-stat/favicon.ico /nebula-benchmark-stat/favicon.ico
COPY --from=builder /nebula-benchmark-stat/config /nebula-benchmark-stat/config
RUN npm install --production

EXPOSE 7001

CMD ["npm", "run", "docker-start"]
