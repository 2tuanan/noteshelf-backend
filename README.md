# Backend Setup

Express.js REST API server for Noteshelf application with MongoDB integration and JWT authentication.

## Environment Configuration

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `4088` |
| `FRONTEND_PORT` | Frontend port (for CORS) | `3066` |
| `DB_URL` | MongoDB connection string | `mongodb://mongo:27017/notetaking` |
| `SECRET` | JWT secret for token signing (min 32 chars) | Generate: `openssl rand -base64 32` |
| `DOMAIN` | Frontend domain (for CORS) | `https://example.com/` (dev: `http://localhost:3066/`) |
| `NODE_ENV` | Environment | `production` or `development` |

### Development Setup

```bash
# Install dependencies
npm install

# Copy and configure .env
cp .env.example .env

# Run with nodemon (auto-reload)
npm run server
```

### Production Setup

In production, environment variables are provided via Docker Compose using an .env file. Ensure NODE_ENV=production and a strong SECRET are configured before deployment.

## API Endpoints

### Authentication
- `POST /api/admin-login` - Admin login
- `POST /api/user-login` - User login
- `POST /api/user-register` - User registration
- `GET /api/get-user` - Get current user info
- `GET /api/logout` - Logout (invalidate token)

### Notes
- `POST /api/add-note` - Create note
- `GET /api/get-notes` - Retrieve user's notes
- `DELETE /api/delete-note/:id` - Delete specific note

### Admin
- `GET /api/get-users` - List all users
- `DELETE /api/reset-user/:id` - Clear user's notes
- `DELETE /api/delete-user/:id` - Delete user account

## Features

- JWT-based authentication with HTTP-only cookies
- Role-based access control (user/admin)
- MongoDB for persistent storage
- CORS protection
- Password hashing with bcrypt
- Error handling and validation
- **body-parser** - Request parsing


