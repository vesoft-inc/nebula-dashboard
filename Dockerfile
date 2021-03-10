FROM node:12-alpine as builder
# Set the working directory to /app
WORKDIR /nebula-dashboard
# Copy the current directory contents into the container at /app
COPY package.json /nebula-dashboard/
# Install any needed packages
RUN npm install
COPY . /nebula-dashboard/

# build and remove front source code
RUN npm run build && npm run tsc && rm -rf app/assets/*
COPY ./app/assets/index.html  /nebula-dashboard/app/assets/

FROM node:12-alpine
 # Make port available to the world outside this container

WORKDIR /nebula-dashboard
COPY --from=builder ./nebula-dashboard/package.json /nebula-dashboard/
COPY --from=builder /nebula-dashboard/app /nebula-dashboard/app
COPY --from=builder /nebula-dashboard/favicon.ico /nebula-dashboard/favicon.ico
COPY --from=builder /nebula-dashboard/config /nebula-dashboard/config
RUN npm install --production

EXPOSE 7003

CMD ["npm", "run", "docker-start"]
