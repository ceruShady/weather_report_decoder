FROM node:slim as build

# ARG VITE_API_URL

# ENV VITE_API_URL=$VITE_API_URL

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /usr/src/app/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose the port that the application listens on.
EXPOSE 80

# Run the application.
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]