# Spur AI Support Agent

A simple AI-powered customer support chat application built with React, Express, TypeScript, SQLite, and Google Gemini.

## Demo

Frontend: [[URL](https://chatasai.netlify.app/)]

Backend: [[URL](https://chatassist-ai.onrender.com/)]

## Screenshots

### Desktop View
![Desktop View](https://res.cloudinary.com/dascnz7t9/image/upload/q_auto/f_auto/v1781447675/for_app_2_yragsz.png)

### Mobile View
![Mobile View](https://res.cloudinary.com/dascnz7t9/image/upload/q_auto/f_auto/v1781448070/gg_chat_a5yute.png)



## Tech Stack

### Frontend

- React
- TypeScript
- Vite

### Backend

- Node.js
- Express
- TypeScript

### Database

- SQLite (better-sqlite3)

### LLM

- Google Gemini 2.5 Flash

## Running Locally

### Backend

Create a `.env` file:

```env
GEMINI_API_KEY=your_api_key
PORT=3001
```

Install dependencies and start the server:

```bash
npm install
npm run dev
```

### Frontend

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3001
```

Install dependencies and start the app:

```bash
npm install
npm run dev
```

## API Endpoints

### Send Message

```http
POST /chat/message
```

Request:

```json
{
  "message": "What is your return policy?",
  "sessionId": "optional"
}
```

### Get Chat History

```http
GET /chat/history/:sessionId
```

### Health Check

```http
GET /health
```

## Architecture

The backend is split into three main layers:

- Routes: request validation and HTTP handling
- Services: chat logic and Gemini integration
- Repository: database operations

Messages are stored in SQLite and associated with a conversation/session ID.

Conversation history is included in prompts so responses remain contextual.

## Features Implemented

- Session-based conversations
- Conversation persistence
- Chat history restoration after refresh
- Gemini integration
- Store FAQ knowledge
- Input validation
- Rate limiting
- Error handling for LLM failures
- Health check endpoint

## Important Render Deployment Note

This project uses a local SQLite database:

```ts
new Database("chat.db")
```

When deployed on Render's free tier, the application may restart after periods of inactivity. Since the SQLite database file is stored on the instance filesystem, chat history may be lost when the service restarts.

For the purposes of this take-home assignment, this tradeoff is acceptable and keeps the deployment simple.

In a production environment, the application should use a persistent database such as PostgreSQL, MySQL, or a managed SQLite solution with persistent storage.

## Tradeoffs

For the assignment I chose SQLite to keep setup simple and focus on the chat workflow.

If this were being extended further, I would likely move to PostgreSQL, add automated tests, and support streaming responses from the LLM.
