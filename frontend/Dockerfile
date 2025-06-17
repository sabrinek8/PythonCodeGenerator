# frontend/Dockerfile

# Stage 1: Build Angular App
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Build the Angular application
RUN npm run build --output-path=dist

# Stage 2: Serve the Angular App with Nginx
FROM nginx:alpine

# Copy built Angular app from previous stage
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Expose the default Nginx HTTP port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

ENV PYTHONUNBUFFERED=1
ENV GROQ_API_KEY=${GROQ_API_KEY}
