# Apna Tracker

Apna Tracker helps users organize learning topics, manage subtopics, and track progress. It is a lightweight apna-tracker starter that demonstrates cookie-based JWT authentication, a React frontend, and an Express/MongoDB backend.

## Project Overview

Apna Tracker provides authenticated users with the ability to create Topics and SubTopics, mark subtopics as complete, attach resource links, and monitor progress grouped by difficulty. The frontend is built with React and React Bootstrap; the backend uses Express and MongoDB (Mongoose).

## Features

- User registration, login and logout (JWT stored in HTTP-only cookie)
- Create, list and manage Topics and SubTopics
- Mark SubTopics Done/Pending — parent Topic status syncs automatically
- Attach resource links (LeetCode, YouTube, articles) to SubTopics
- Progress view grouped by difficulty (Easy / Medium / Hard)

## Tech Stack

- Frontend: React, React Bootstrap, Redux Toolkit, Vite
- Backend: Node.js, Express, Mongoose (MongoDB)
- Auth: JSON Web Tokens (stored in HTTP-only cookies)

## Setup Instructions

1. Clone the repository and install dependencies:

```powershell
git clone <repo-url>
cd apna-tracker
npm install
cd frontend
npm install
```

2. Create a `.env` file in the project root (see Environment Variables below).

3. Run the application (development):

```powershell
# from repository root
npm run dev

# frontend served by Vite, backend by nodemon
```

4. Open the app at http://localhost:3000 and the backend API runs on http://localhost:5000 by default.

## Environment Variables

Create a `.env` in the project root with the following required variables:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
```

Keep `JWT_SECRET` secure in production and use environment-specific configuration for deployed environments.

## Deployment

1. Build the frontend:

```powershell
cd frontend
npm run build
```

2. Serve the built frontend from the backend or host it via any static hosting provider. Ensure the backend `MONGO_URI` and `JWT_SECRET` are set in production environment variables.

3. Start the backend server (production):

```powershell
NODE_ENV=production PORT=5000 node server.js
```

## Notes

- This README focuses on local development and simple deployments. For production, secure your database credentials, enable HTTPS, and follow best practices for cookie security and CORS.
- The project is intended as a learning starter and can be extended with tests, CI/CD, and additional features.

---

If you want, I can also update package metadata (package.json) and any docs to use the new project name consistently.
