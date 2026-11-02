const { describe, it, before } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Ensure environment variables are loaded
process.env.JWT_SECRET = 'test_secret_key_12345';
process.env.JWT_EXPIRES_IN = '1d';
process.env.NODE_ENV = 'test';

const User = require('../src/models/user.model');
const Post = require('../src/models/post.model');
const { protect } = require('../src/middleware/auth.middleware');
const { notFound, errorHandler } = require('../src/middleware/error.middleware');
const {
  registerUser,
  loginUser,
  getUserProfile,
  generateToken
} = require('../src/controllers/user.controller');
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} = require('../src/controllers/post.controller');
const app = require('../src/app');

// Helper to create mock Express response
const createMockRes = () => {
  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };
  return res;
};

describe('1. User Model & Password Hashing Tests', () => {
  it('should hash the password on save hook', async () => {
    const rawPassword = 'mySecurePassword123';
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: rawPassword
    });

    // Simulate pre-save hook manually or via mongoose validation
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    assert.notStrictEqual(user.password, rawPassword);
    assert.strictEqual(user.password.startsWith('$2'), true);
  });

  it('should verify password correctly using matchPassword', async () => {
    const rawPassword = 'mySecurePassword123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword
    });

    const isMatch = await user.matchPassword(rawPassword);
    const isMismatch = await user.matchPassword('wrongPassword');

    assert.strictEqual(isMatch, true);
    assert.strictEqual(isMismatch, false);
  });

  it('should exclude password when converted to JSON via toJSON()', () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'secretPassword'
    });

    const json = user.toJSON();
    assert.strictEqual(json.password, undefined);
    assert.strictEqual(json.name, 'John Doe');
    assert.strictEqual(json.email, 'john@example.com');
  });
});

describe('2. JWT Authentication & Token Utilities', () => {
  it('should generate a valid signed JWT token', () => {
    const userId = '60d0fe4f5311236168a109ca';
    const token = generateToken(userId);

    assert.ok(token);
    assert.strictEqual(typeof token, 'string');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    assert.strictEqual(decoded.id, userId);
  });
});

describe('3. Auth Middleware (protect)', () => {
  it('should reject request when Authorization header is missing', async () => {
    const req = { headers: {} };
    const res = createMockRes();
    let nextCalled = false;

    await protect(req, res, () => {
      nextCalled = true;
    });

    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(nextCalled, false);
    assert.match(res.body.message, /No token provided/i);
  });

  it('should reject request when token is invalid or corrupted', async () => {
    const req = {
      headers: { authorization: 'Bearer invalid.token.value' }
    };
    const res = createMockRes();
    let nextCalled = false;

    await protect(req, res, () => {
      nextCalled = true;
    });

    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(nextCalled, false);
    assert.match(res.body.message, /Invalid token/i);
  });
});

describe('4. User Authentication Controllers', () => {
  it('registerUser should validate required fields', async () => {
    const req = { body: { name: 'John' } }; // missing email & password
    const res = createMockRes();

    await registerUser(req, res, (err) => {
      if (err) throw err;
    });

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.match(res.body.message, /Please provide name, email, and password/i);
  });

  it('loginUser should validate required fields', async () => {
    const req = { body: {} }; // missing both email & password
    const res = createMockRes();

    await loginUser(req, res, (err) => {
      if (err) throw err;
    });

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.match(res.body.message, /Please provide both email and password/i);
  });

  it('getUserProfile should return authenticated user data', async () => {
    const req = {
      user: {
        _id: '60d0fe4f5311236168a109ca',
        name: 'Jane Doe',
        email: 'jane@example.com'
      }
    };
    const res = createMockRes();

    await getUserProfile(req, res, (err) => {
      if (err) throw err;
    });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.name, 'Jane Doe');
  });
});

describe('5. Post CRUD Controllers & Authorization Rules', () => {
  it('createPost should validate required fields (title & description)', async () => {
    const req = {
      body: {},
      user: { _id: '60d0fe4f5311236168a109ca' }
    };
    const res = createMockRes();

    await createPost(req, res, (err) => {
      if (err) throw err;
    });

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.match(res.body.message, /provide both title and description/i);
  });

  it('getPostById should reject invalid ObjectId format', async () => {
    const req = { params: { id: 'invalid-id-123' } };
    const res = createMockRes();

    await getPostById(req, res, (err) => {
      if (err) throw err;
    });

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.match(res.body.message, /Invalid post ID format/i);
  });

  it('updatePost should reject request if caller is not the owner (403 Forbidden)', async () => {
    const ownerId = '60d0fe4f5311236168a109ca';
    const otherUserId = '70d0fe4f5311236168a109cb';
    const postId = '80d0fe4f5311236168a109cc';

    // Mock Post.findById to return a post owned by ownerId
    const originalFindById = Post.findById;
    Post.findById = async () => ({
      _id: postId,
      title: 'Original Title',
      description: 'Original Description',
      author: ownerId
    });

    try {
      const req = {
        params: { id: postId },
        body: { title: 'Updated Title' },
        user: { _id: otherUserId } // Not the owner
      };
      const res = createMockRes();

      await updatePost(req, res, (err) => {
        if (err) throw err;
      });

      assert.strictEqual(res.statusCode, 403);
      assert.strictEqual(res.body.success, false);
      assert.match(res.body.message, /Forbidden.*Only the author can update/i);
    } finally {
      Post.findById = originalFindById;
    }
  });

  it('deletePost should reject request if caller is not the owner (403 Forbidden)', async () => {
    const ownerId = '60d0fe4f5311236168a109ca';
    const otherUserId = '70d0fe4f5311236168a109cb';
    const postId = '80d0fe4f5311236168a109cc';

    const originalFindById = Post.findById;
    Post.findById = async () => ({
      _id: postId,
      author: ownerId
    });

    try {
      const req = {
        params: { id: postId },
        user: { _id: otherUserId } // Not the owner
      };
      const res = createMockRes();

      await deletePost(req, res, (err) => {
        if (err) throw err;
      });

      assert.strictEqual(res.statusCode, 403);
      assert.strictEqual(res.body.success, false);
      assert.match(res.body.message, /Forbidden.*Only the author can delete/i);
    } finally {
      Post.findById = originalFindById;
    }
  });
});

describe('6. Error Middleware & 404 Handler', () => {
  it('notFound handler should return 404 with proper message', () => {
    const req = { originalUrl: '/api/nonexistent' };
    const res = createMockRes();
    let passedError = null;

    notFound(req, res, (err) => {
      passedError = err;
    });

    assert.strictEqual(res.statusCode, 404);
    assert.ok(passedError);
    assert.strictEqual(passedError.message, 'Resource not found - /api/nonexistent');
  });

  it('errorHandler should format CastError cleanly', () => {
    const castErr = new Error('Cast Error');
    castErr.name = 'CastError';
    castErr.kind = 'ObjectId';
    castErr.value = 'bad-id';

    const req = {};
    const res = createMockRes();

    errorHandler(castErr, req, res, () => {});

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.match(res.body.message, /Invalid resource ID format/i);
  });

  it('errorHandler should format Duplicate Key Error (11000) cleanly', () => {
    const dupErr = new Error('Duplicate key');
    dupErr.code = 11000;
    dupErr.keyValue = { email: 'test@example.com' };

    const req = {};
    const res = createMockRes();

    errorHandler(dupErr, req, res, () => {});

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.match(res.body.message, /A record with that email already exists/i);
  });
});

describe('7. Express HTTP Server Integration', () => {
  let server;
  let baseUrl;

  before(async () => {
    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  it('GET / should return 200 with API welcome info', async () => {
    const response = await fetch(`${baseUrl}/`);
    assert.strictEqual(response.status, 200);

    const body = await response.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.message, 'Welcome to the Backend Tutorial REST API');
    assert.ok(body.endpoints.users);
    assert.ok(body.endpoints.posts);
  });

  it('GET /undefined-route should return 404 Not Found', async () => {
    const response = await fetch(`${baseUrl}/undefined-route`);
    assert.strictEqual(response.status, 404);

    const body = await response.json();
    assert.strictEqual(body.success, false);
    assert.match(body.message, /Resource not found/i);
  });

  it('POST /api/users/register without body should return 400 Bad Request', async () => {
    const response = await fetch(`${baseUrl}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert.strictEqual(response.status, 400);

    const body = await response.json();
    assert.strictEqual(body.success, false);
  });

  it('GET /api/users/profile without token should return 401 Unauthorized', async () => {
    const response = await fetch(`${baseUrl}/api/users/profile`);
    assert.strictEqual(response.status, 401);

    const body = await response.json();
    assert.strictEqual(body.success, false);
    assert.match(body.message, /No token provided/i);
  });

  it('POST /api/posts without token should return 401 Unauthorized', async () => {
    const response = await fetch(`${baseUrl}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test', description: 'Test' })
    });
    assert.strictEqual(response.status, 401);

    const body = await response.json();
    assert.strictEqual(body.success, false);
    assert.match(body.message, /No token provided/i);
  });

  it('Server closes gracefully', async () => {
    await new Promise((resolve) => server.close(resolve));
  });
});
