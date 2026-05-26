# Banking System (Backend)

A simple banking backend built with Node.js, Express and MongoDB. This project provides user authentication, account management, transactions and a ledger for a basic banking system.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Run Locally](#run-locally)
- [API Endpoints (Overview)](#api-endpoints-overview)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This repository implements the backend for a simple banking system. It includes user registration and login, account creation and management, transaction handling, and basic ledger entries.

## Features

- User authentication (JWT-based)
- Account CRUD operations
- Create and record transactions (debits / credits)
- Ledger model to track balances
- Basic email service integration (for notifications)

## Tech Stack

- Node.js
- Express
- MongoDB / Mongoose
- JWT for authentication

## Prerequisites

- Node.js >= 16
- npm
- A running MongoDB instance (local or cloud)

## Installation

Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd Banking\ System
npm install
```

## Environment Variables

Create a `.env` file in the project root (the editor currently has one open). At minimum provide:

- `PORT` — port to run the server (e.g. 3000)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWTs
- `EMAIL_USER` / `EMAIL_PASS` — (optional) SMTP credentials used by the email service

Example `.env` snippet:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/banking
JWT_SECRET=your_jwt_secret
EMAIL_USER=you@example.com
EMAIL_PASS=supersecret
```

## Run Locally

Start the server:

```bash
node server.js
# or with nodemon
nodemon server.js
```

The app entry is [server.js](server.js#L1) which loads the Express app from [src/app.js](src/app.js#L1) and connects to the database using [src/config/db.js](src/config/db.js#L1).

## API Endpoints (Overview)

This project exposes three main route groups located in `src/routes`:

- Authentication: [src/routes/auth.routes.js](src/routes/auth.routes.js#L1)
  - `POST /api/auth/register` — register a new user
  - `POST /api/auth/login` — login and receive a JWT
- Accounts: [src/routes/account.routes.js](src/routes/account.routes.js#L1)
  - `GET /api/accounts` — list accounts (auth required)
  - `POST /api/accounts` — create an account
  - `GET /api/accounts/:id` — get account details
  - `PUT /api/accounts/:id` — update account
  - `DELETE /api/accounts/:id` — delete account
- Transactions: [src/routes/transaction.routes.js](src/routes/transaction.routes.js#L1)
  - `POST /api/transactions` — create a transaction (debit/credit)
  - `GET /api/transactions` — list transactions
  - `GET /api/transactions/:id` — transaction details

Example request (login):

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

Protect routes by including the returned JWT in the `Authorization` header:

```http
Authorization: Bearer <token>
```

## Project Structure

Top-level entry points and important files:

- [server.js](server.js#L1): app bootstrap and server start
- [src/app.js](src/app.js#L1): Express app, middleware and route mounting
- [src/config/db.js](src/config/db.js#L1): MongoDB connection
- [src/controllers](src/controllers): request handlers (auth, account, transaction)
- [src/models](src/models): Mongoose models (`user.model.js`, `account.model.js`, `transaction.model.js`, `ledger.model.js`, `blackList.model.js`)
- [src/routes](src/routes): route definitions
- [src/middlewares/auth.middleware.js](src/middlewares/auth.middleware.js#L1): authentication guard
- [src/services/email.service.js](src/services/email.service.js#L1): email helper

## Contributing

Contributions are welcome. Open an issue or create a PR describing the change. Keep changes focused and add tests where appropriate.

## License

This project does not include a license file. Add one (for example an MIT license) if you intend to make it public.
