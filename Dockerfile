# Stage 1: Build the Vite app
FROM node:18 as build

WORKDIR /app

# Install dependencies with legacy peer deps
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy app source code and build it
COPY . .
RUN npm run build

# Stage 2: Serve the app using nginx on port 8080
FROM nginx:alpine

# Copy Vite build output to nginx's public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config that uses port 8080 and supports SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Cloud Run expects
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
