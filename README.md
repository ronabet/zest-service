
# NestJS Redis Caching Application

This is a simple NestJS application that demonstrates the use of Redis for caching github top ranked repos with Swagger documentation for the API.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v16.x or later)
- npm (v8.x or later)
- Redis server running locally

## Installation

To get started with the project, follow these steps:

1. Install the dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root of your project and update it with your Redis configuration:
```plaintext
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Running the Application

To start the application in development mode, run the following command:
```bash
npm run start:dev
```

This command runs the server with Nodemon, which will watch for any file changes and automatically restart the server, making it ideal for development.

## Swagger API Documentation

This project includes Swagger for API documentation. To view the Swagger UI, navigate to:
```
http://localhost:3000/swagger
```

This URL will take you to the Swagger interface where you can view all the API endpoints and their specifications.

## Docker

Run the following command to start your services using Docker:
```bash
docker-compose up -d
```
