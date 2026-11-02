# 🚀 YASHBANTROUT REST API — Complete Backend Assignment

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" alt="Postman" />
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git" />
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
</p>

<p align="center">
  <strong>Production-ready RESTful API built with Node.js, Express, MongoDB Atlas, and JWT Authentication.</strong><br>
  <em>Features complete User Authentication, Post CRUD operations, and author ownership validation.</em>
</p>

---

## 📸 API Operations & Testing Dashboard

> 💡 **Static UI Available:** A static interactive dashboard is included in [`public/test-dashboard.html`](public/test-dashboard.html) and automatically served at `http://localhost:5000/docs` when the server is running.

---

### 🔐 Authentication Endpoints

<table>
<tr>
<td width="50%" valign="top">

#### `POST` `/api/users/register` &nbsp; ![Status](https://img.shields.io/badge/Status-201%20Created-2ea44f?style=flat-square)
*Register a new user account with hashed password.*

**Request Body:**
```json
{
  "name": "Chinmay Rout",
  "email": "chinmay@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "6ae8a7ca98de28308485a26e",
    "name": "Chinmay Rout",
    "email": "chinmay@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
*Tags: `Public` | `Auto-saves token`*

</td>
<td width="50%" valign="top">

#### `POST` `/api/users/login` &nbsp; ![Status](https://img.shields.io/badge/Status-200%20OK-2ea44f?style=flat-square)
*Authenticate user and obtain JWT Bearer token.*

**Request Body:**
```json
{
  "email": "chinmay@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "_id": "6ae8a7ca98de28308485a26e",
    "name": "Chinmay Rout",
    "email": "chinmay@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
*Tags: `Public` | `Auto-saves token`*

</td>
</tr>
</table>

---

### 📝 Posts CRUD Endpoints

<table>
<tr>
<td width="50%" valign="top">

#### `POST` `/api/posts` &nbsp; ![Status](https://img.shields.io/badge/Status-201%20Created-2ea44f?style=flat-square)
*Create a new post tied to the logged-in user.*

**Headers:**
```http
Authorization: Bearer {{token}}
```

**Request Body:**
```json
{
  "title": "My First Post",
  "description": "Created via Postman!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "6ae8a7d998de28308485a26f",
    "title": "My First Post",
    "description": "Created via Postman!",
    "author": {
      "_id": "6ae8a7ca98de28308485a26e",
      "name": "Chinmay Rout"
    }
  }
}
```
*Tags: `🔒 Protected` | `Auto-saves post_id`*

</td>
<td width="50%" valign="top">

#### `GET` `/api/posts` &nbsp; ![Status](https://img.shields.io/badge/Status-200%20OK-2ea44f?style=flat-square)
*Retrieve all posts with populated author information.*

**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "6ae8a7d998de28308485a26f",
      "title": "My First Post",
      "description": "Created via Postman!",
      "author": {
        "_id": "6ae8a7ca98de28308485a26e",
        "name": "Chinmay Rout",
        "email": "chinmay@example.com"
      }
    }
  ]
}
```
*Tags: `🌐 Public` | `Returns array`*

</td>
</tr>

<tr>
<td width="50%" valign="top">

#### `GET` `/api/posts/:id` &nbsp; ![Status](https://img.shields.io/badge/Status-200%20OK-2ea44f?style=flat-square)
*Retrieve an individual post by ID.*

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "6ae8a7d998de28308485a26f",
    "title": "My First Post",
    "description": "Created via Postman!",
    "author": {
      "_id": "6ae8a7ca98de28308485a26e",
      "name": "Chinmay Rout"
    }
  }
}
```
*Tags: `🌐 Public` | `Uses {{post_id}}`*

</td>
<td width="50%" valign="top">

#### `PUT` `/api/posts/:id` &nbsp; ![Status](https://img.shields.io/badge/Status-200%20OK-2ea44f?style=flat-square)
*Update post title or description (Owner only).*

**Headers:**
```http
Authorization: Bearer {{token}}
```

**Request Body:**
```json
{
  "title": "My Updated Post",
  "description": "Updated via Postman!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "_id": "6ae8a7d998de28308485a26f",
    "title": "My Updated Post",
    "description": "Updated via Postman!"
  }
}
```
*Tags: `🔒 Protected` | `Owner only (403 for others)`*

</td>
</tr>

<tr>
<td colspan="2" valign="top">

#### `DELETE` `/api/posts/:id` &nbsp; ![Status](https://img.shields.io/badge/Status-200%20OK-2ea44f?style=flat-square)
*Delete a post by ID (Owner only).*

**Headers:**
```http
Authorization: Bearer {{token}}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post deleted successfully",
  "data": {
    "id": "6ae8a7d998de28308485a26f"
  }
}
```
*Tags: `🔒 Protected` | `Owner only (403 for others)`*

</td>
</tr>
</table>

---

## 📁 Clean MVC Architecture

```text
YASHBANTROUT250630WEBASSIGNEMENT/
│
├── public/
│   └── test-dashboard.html       # Static Postman testing UI (served at /docs)
│
├── src/
│   ├── config/
│   │   └── database.js           # MongoDB Atlas connection handler
│   │
│   ├── controllers/
│   │   ├── user.controller.js    # Register, login, and profile logic
│   │   └── post.controller.js    # Post CRUD operations with author verification
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT Bearer token authentication
│   │   └── error.middleware.js   # 404 handler & centralized error formatting
│   │
│   ├── models/
│   │   ├── user.model.js         # Mongoose User schema with bcrypt hashing
│   │   └── post.model.js         # Mongoose Post schema with User reference
│   │
│   ├── routes/
│   │   ├── user.route.js         # User auth routes
│   │   └── post.route.js         # Post CRUD routes
│   │
│   ├── app.js                    # Express app configuration & static assets
│   └── index.js                  # Entry point & server listener
│
├── postman/
│   └── backend-tutorial.postman_collection.json # Exported Postman collection
│
├── tests/
│   └── api.test.js               # 22 automated unit & integration tests
│
├── .env.example                  # Environment configuration template
├── .gitignore                    # Excludes .env, node_modules, and cache
└── package.json                  # Dependencies and scripts
```

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/YashbantRout/AssignmentBackend.git
cd AssignmentBackend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
```

### 3. Start Development Server
```bash
npm run dev
# or on Windows PowerShell:
npm.cmd run dev
```

Server will run at `http://localhost:5000` with live database connection:
```text
[Database] MongoDB Connected successfully: ac-ey1hpsx-shard-00-02.diwo9t7.mongodb.net
[Server] Server is running on port 5000
[Server] Environment: development
[Server] Health check: http://localhost:5000/
```

### 4. Open Static Testing Dashboard
Open `http://localhost:5000/docs` in your browser to view the interactive operations dashboard.

---

## 📮 Postman Testing Guide

1. Open Postman and click **Import**.
2. Select [`postman/backend-tutorial.postman_collection.json`](postman/backend-tutorial.postman_collection.json).
3. The collection is pre-configured with **Automated Test Scripts**:
   - Running **Login User** automatically captures and saves the JWT token into `{{token}}`.
   - Running **Create Post** automatically captures and saves the created post ID into `{{post_id}}`.
   - All protected requests automatically use `Bearer {{token}}`.

---

## 🧪 Automated Testing

Run the built-in test suite:
```bash
npm test
```

```text
✔ 1. User Model & Password Hashing Tests (3 tests)
✔ 2. JWT Authentication & Token Utilities (1 test)
✔ 3. Auth Middleware (protect) (2 tests)
✔ 4. User Authentication Controllers (3 tests)
✔ 5. Post CRUD Controllers & Authorization Rules (4 tests)
✔ 6. Error Middleware & 404 Handler (3 tests)
✔ 7. Express HTTP Server Integration (6 tests)
ℹ tests 22 | suites 7 | pass 22 | fail 0
```

---

## 🛡️ Security Highlights
- **Password Salting & Hashing:** Implemented with `bcrypt` (10 rounds).
- **Password Sanitization:** Custom `toJSON()` on User schema automatically prevents passwords from ever appearing in responses.
- **Resource Ownership Authorization:** Updates and deletes verify that `post.author == req.user._id`, returning `403 Forbidden` for unauthorized users.
- **Credential Protection:** `.env` is ignored by `.gitignore` to prevent credential exposure.

---

## 📄 License
ISC License © 2026 Yashbant Rout
