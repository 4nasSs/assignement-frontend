
FROM node:20-alpine AS build


WORKDIR /app


COPY package*.json ./

# Install dependencies
RUN npm install


COPY . .

# Build the React application for production
RUN npm run build


FROM nginx:alpine


COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80


CMD ["nginx", "-g", "daemon off;"]