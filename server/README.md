
# ELI Backend Server

This directory contains the Node.js backend server for the ELI project. It is responsible for handling user authentication, managing database connections, and providing a RESTful API for the frontend application.

## Table of Contents

  - [Prerequisites](https://www.google.com/search?q=%23prerequisites)
  - [Installation & Setup](https://www.google.com/search?q=%23installation--setup)
  - [Running the Server](https://www.google.com/search?q=%23running-the-server)
  - [Project Structure](https://www.google.com/search?q=%23project-structure)

-----

## Prerequisites

Before you begin, ensure you have the following installed on your system:

  - [Node.js](https://nodejs.org/) (v18 or newer recommended)
  - [npm](https://www.npmjs.com/) (comes with Node.js)
  - [PostgreSQL](https://www.postgresql.org/) (v17)

-----

## Installation & Setup

Follow these steps to get the backend server running locally.

### Install Dependencies
Install all the required npm packages:

```bash
npm install
npm install dotenv
```


## Running the Server

To start the server in development mode, run the following command:

```
node server.js
```

The server will start and listen for incoming requests on the port specified in your `.env` file (default is `3001`).

-----

## Project Structure

  - **`server.js`**: The main entry point of the application. It initializes the Express app, applies middleware, and mounts the API routes.
  - **`config.js`**: Loads and exports configuration variables from the `.env` file.
  - **`database.js`**: Initializes and exports the PostgreSQL connection pool.
  - **`.env`**: Stores secret credentials and environment-specific settings.
