# Use an official Node.js runtime as the base image
FROM node:16.13.0

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the Docker container
COPY package*.json ./

# Install the application dependencies in the Docker container
RUN npm install

# Copy the rest of the application to the Docker container
COPY . .

# Expose port 3000 for the application
EXPOSE 3000

# Start the application
CMD ["npm", "start"]