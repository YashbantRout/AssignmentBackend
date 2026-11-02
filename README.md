# Backend Development Assignment – Node.js, Express & MongoDB REST API

A complete, production-ready, beginner-friendly RESTful backend API built with **Node.js**, **Express.js**, **MongoDB Atlas**, **Mongoose**, **JWT Authentication**, and **Bcrypt**.

This project implements an MVC-style architecture featuring secure user authentication (Register, Login, Profile) and full CRUD operations for Posts (Create, Read, Update, Delete) with resource ownership authorization.

Based on the [Backend Tutorial](https://www.youtube.com/watch?v=KOutPbKc9UM&t=2s).

---

## 📋 Table of Contents
- [Technologies Used](#-technologies-used)
- [Project Architecture & Folder Structure](#-project-architecture--folder-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [MongoDB Atlas Setup Guide](#-mongodb-atlas-setup-guide)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Postman Testing Guide](#-postman-testing-guide)
- [Sample Requests & Responses](#-sample-requests--responses)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Security Best Practices](#-security-best-practices)

---

## 🛠 Technologies Used

- **Node.js** (v20+ / CommonJS) - JavaScript runtime environment
- **Express.js** (v5) - Minimalist web framework for Node.js
- **MongoDB Atlas & Mongoose** (v9) - Cloud NoSQL database and Object Data Modeling (ODM) library
- **bcrypt** - Salting and hashing passwords
- **jsonwebtoken (JWT)** - Stateless authentication and token verification
- **dotenv** - Loading configuration and credentials securely from `.env`
- **Nodemon** - Development server with live auto-reload
- **Postman** - API design, testing, and documentation
- **Git & GitHub** - Version control and repository management

---

## 📁 Project Architecture & Folder Structure

The project follows a clean **MVC (Model-View-Controller / Model-Controller-Route)** architectural pattern:

```text
backend-tutorial/
│
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection handler with error handling
│   │
│   ├── controllers/
│   │   ├── user.controller.js   # User registration, login, and profile logic
│   │   └── post.controller.js   # Post CRUD operations with ownership validation
│   │
│   ├── models/
│   │   ├── user.model.js        # Mongoose User schema, password hashing hooks
│   │   └── post.model.js        # Mongoose Post schema with User reference
│   │
│   ├── routes/
│   │   ├── user.route.js        # User auth route definitions
│   │   └── post.route.js        # Post CRUD route definitions
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js   # Bearer JWT verification middleware
│   │   └── error.middleware.js  # Centralized error and 404 handler
│   │
│   ├── app.js                   # Express app setup and middleware registration
│   └── index.js                 # Server startup and database bootstrap
│
├── postman/
│   └── backend-tutorial.postman_collection.json  # Exported Postman collection
│
├── tests/
│   └── api.test.js              # Automated test suite (22 tests)
│
├── .env.example                 # Template for environment variables
├── .env                         # Local environment variables (never committed)
├── .gitignore                   # Excludes node_modules, .env, and logs
├── package.json                 # Project dependencies and npm scripts
└── README.md                    # Project documentation
```

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Version 18.x or later)
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)
- [Postman](https://www.postman.com/downloads/) for testing

---

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/backend-tutorial.git
   cd backend-tutorial
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the `.env.example` file to create your own `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in your MongoDB Atlas connection string and JWT secret (see below).

---

## ☁️ MongoDB Atlas Setup Guide

Follow these beginner steps to connect your MongoDB Atlas cloud database:

1. **Sign Up / Log In:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in.
2. **Create a Free Cluster:**
   - Click **Create Database**.
   - Choose the **M0 Free Tier**.
   - Select your preferred cloud provider and region closest to you.
   - Click **Create Deployment**.
3. **Set Up Security & Credentials:**
   - **Database User:** Under **Security > Database Access**, click **Add New Database User**.
     - Authentication Method: **Password**.
     - Enter a Username (e.g. `dbAdmin`) and a secure Password.
     - Role: **Read and write to any database**.
     - Click **Add User**.
   - **Network Access (IP Whitelist):** Under **Security > Network Access**, click **Add IP Address**.
     - For development/tutorial purposes, select **Allow Access from Anywhere** (`0.0.0.0/0`) or enter your current IP address.
     - Click **Confirm**.
4. **Get Connection String:**
   - In **Database Deployments**, click **Connect**.
   - Select **Drivers** (Node.js).
   - Copy the connection string format:
     ```text
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/backend-assignment?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with the credentials you created in Step 3.
5. **Paste into `.env`:**
   ```env
   MONGODB_URI=mongodb+srv://myUsername:myPassword@cluster0.abcde.mongodb.net/backend-assignment?retryWrites=true&w=majority
   ```

> [!IMPORTANT]
> Never commit your `.env` file or paste real credentials into public code repositories! The `.gitignore` file automatically protects `.env`.

---

## 🔑 Environment Variables

The application requires the following environment variables configured in `.env`:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | The port the Express HTTP server listens on | `5000` |
| `MONGODB_URI` | MongoDB Atlas / Local MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens | `your_super_secret_jwt_key` |
| `JWT_EXPIRES_IN` | Token expiration timeframe | `1d` (1 day) |

---

## ▶️ Running the Application

### Development Mode (with Nodemon auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Running Automated Tests
```bash
npm test
```

When started, you should see console output:
```text
[Database] MongoDB Connected successfully: cluster0-shard-00-00.mongodb.net
[Server] Server is running on port 5000
[Server] Environment: development
[Server] Health check: http://localhost:5000/
```

---

## 📡 API Endpoints Reference

### 1. Authentication Endpoints (`/api/users`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Public | Register a new user with hashed password |
| `POST` | `/api/users/login` | Public | Authenticate user & return signed JWT token |
| `GET` | `/api/users/profile` | Private | Retrieve authenticated user's profile |

### 2. Posts CRUD Endpoints (`/api/posts`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/posts` | Private | Create a new post (associated with current user) |
| `GET` | `/api/posts` | Public | Retrieve all posts (with author details) |
| `GET` | `/api/posts/:id` | Public | Retrieve single post by ID (with author details) |
| `PUT` | `/api/posts/:id` | Private | Update post (only allowed for post owner) |
| `DELETE` | `/api/posts/:id` | Private | Delete post (only allowed for post owner) |

---

## 📮 Postman Testing Guide

A complete, pre-configured Postman Collection is included in the project:
`postman/backend-tutorial.postman_collection.json`

### Importing into Postman
1. Open the **Postman** desktop application or web version.
2. Click **Import** (top left).
3. Select or drag-and-drop `postman/backend-tutorial.postman_collection.json`.
4. The collection **Backend Development Assignment API** will appear in your sidebar.

### Automated JWT Token Handling
The collection is equipped with automatic Postman Test Scripts:
- When you execute **Login User (Success)**, Postman automatically extracts the `token` from the response and stores it in the `jwtToken` variable.
- When you execute **Create Post (Success)**, Postman automatically extracts the created post ID and stores it in the `postId` variable.
- Subsequent private requests (`GET /profile`, `PUT /posts/:id`, `DELETE /posts/:id`) automatically attach the Bearer token in the `Authorization` header.

### Recommended Testing Sequence
1. **POST** `/api/users/register` - Create account
2. **POST** `/api/users/login` - Obtain JWT token (auto-saved)
3. **GET** `/api/users/profile` - Verify profile retrieval
4. **POST** `/api/posts` - Create post (ID auto-saved)
5. **GET** `/api/posts` - Retrieve all posts
6. **GET** `/api/posts/:id` - Retrieve post by ID
7. **PUT** `/api/posts/:id` - Update post title/description
8. **DELETE** `/api/posts/:id` - Delete post

---

## 📝 Sample Requests & Responses

### 1. Register User
**Request:**
`POST http://localhost:5000/api/users/register`
```json
{
  "name": "Yashbant Rout",
  "email": "yashbant@example.com",
  "password": "Password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "673f4b23a1e2d4e891234501",
    "name": "Yashbant Rout",
    "email": "yashbant@example.com",
    "createdAt": "2026-11-02T14:20:00.000Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login User
**Request:**
`POST http://localhost:5000/api/users/login`
```json
{
  "email": "yashbant@example.com",
  "password": "Password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "_id": "673f4b23a1e2d4e891234501",
    "name": "Yashbant Rout",
    "email": "yashbant@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Get User Profile (Protected)
**Request:**
`GET http://localhost:5000/api/users/profile`  
*Header:* `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "_id": "673f4b23a1e2d4e891234501",
    "name": "Yashbant Rout",
    "email": "yashbant@example.com",
    "createdAt": "2026-11-02T14:20:00.000Z",
    "updatedAt": "2026-11-02T14:20:00.000Z"
  }
}
```

---

### 4. Create Post (Protected)
**Request:**
`POST http://localhost:5000/api/posts`  
*Header:* `Authorization: Bearer <token>`
```json
{
  "title": "Mastering Node.js and MongoDB Atlas",
  "description": "Step-by-step implementation of REST API with JWT authentication and Mongoose."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "673f4b98a1e2d4e891234599",
    "title": "Mastering Node.js and MongoDB Atlas",
    "description": "Step-by-step implementation of REST API with JWT authentication and Mongoose.",
    "author": {
      "_id": "673f4b23a1e2d4e891234501",
      "name": "Yashbant Rout",
      "email": "yashbant@example.com"
    },
    "createdAt": "2026-11-02T14:25:00.000Z",
    "updatedAt": "2026-11-02T14:25:00.000Z"
  }
}
```

---

### 5. Get All Posts (Public)
**Request:**
`GET http://localhost:5000/api/posts`

**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "673f4b98a1e2d4e891234599",
      "title": "Mastering Node.js and MongoDB Atlas",
      "description": "Step-by-step implementation of REST API with JWT authentication and Mongoose.",
      "author": {
        "_id": "673f4b23a1e2d4e891234501",
        "name": "Yashbant Rout",
        "email": "yashbant@example.com"
      },
      "createdAt": "2026-11-02T14:25:00.000Z",
      "updatedAt": "2026-11-02T14:25:00.000Z"
    }
  ]
}
```

---

### 6. Update Post (Owner Only)
**Request:**
`PUT http://localhost:5000/api/posts/673f4b98a1e2d4e891234599`  
*Header:* `Authorization: Bearer <token>`
```json
{
  "title": "Mastering Node.js, Express & Atlas (Updated)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "_id": "673f4b98a1e2d4e891234599",
    "title": "Mastering Node.js, Express & Atlas (Updated)",
    "description": "Step-by-step implementation of REST API with JWT authentication and Mongoose.",
    "author": {
      "_id": "673f4b23a1e2d4e891234501",
      "name": "Yashbant Rout",
      "email": "yashbant@example.com"
    },
    "createdAt": "2026-11-02T14:25:00.000Z",
    "updatedAt": "2026-11-02T14:30:00.000Z"
  }
}
```

---

### 7. Delete Post (Owner Only)
**Request:**
`DELETE http://localhost:5000/api/posts/673f4b98a1e2d4e891234599`  
*Header:* `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post deleted successfully",
  "data": {
    "id": "673f4b98a1e2d4e891234599"
  }
}
```

---

## 🧪 Testing & Quality Assurance

This codebase includes an automated test suite executed with Node's native test runner:
```bash
npm test
```

### Test Coverage Summary:
- **User Model Tests:** Schema validation, bcrypt salt/hash generation, password comparison, and automatic removal of sensitive `password` field on `toJSON()`.
- **JWT Utilities:** Signing tokens with user ID and payload verification.
- **Auth Middleware (`protect`):** Missing headers, missing tokens, invalid tokens, and expired tokens.
- **Controller Validations:** Input sanitization, missing field detection, duplicate email handling, and 400 Bad Request error returns.
- **Resource Ownership:** Ensuring that non-authors attempting to update or delete a post receive `403 Forbidden`.
- **Centralized Error Handling:** Formatting Mongoose `CastError`, `ValidationError`, duplicate key code `11000`, and malformed JSON payloads.
- **HTTP Integration:** End-to-end routing, 404 handler, and server start/stop verification.

---

## 🛡 Security Best Practices

1. **Passwords Hashed with Salt:** Passwords are never stored or logged in plain text. They are hashed using `bcrypt` with 10 salt rounds.
2. **Password Sanitization:** Custom `toJSON` method strips passwords from any object serialized to JSON, ensuring accidental leaks never happen.
3. **Stateless JWTs:** Tokens include standard claims and expiration times.
4. **Ownership Verification:** Before performing `PUT` or `DELETE` on a post, the author ID is strictly verified against `req.user._id`.
5. **Git Protection:** `.env` and `node_modules` are excluded via `.gitignore` to prevent secret leakage.

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
