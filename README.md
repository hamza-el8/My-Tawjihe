# MyTawjeh – AI Academic Orientation Platform

A MERN stack web app for intelligent academic orientation for Moroccan students.

## Project Structure

```
mytawjihi_project/
├── frontend/   # React + Vite + Tailwind
└── backend/    # Express + MongoDB (Mongoose)
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally **or** a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

---

## 1. Backend Setup

```bash
cd backend
npm install
```

Copy the example env file and fill in your values:

```bash
copy .env.example .env
```

`.env` variables:

| Variable    | Default                                  | Description                  |
|-------------|------------------------------------------|------------------------------|
| `PORT`      | `5000`                                   | Port the server listens on   |
| `MONGO_URI` | `mongodb://localhost:27017/mytawjeh`     | MongoDB connection string    |
| `CLIENT_URL`| `http://localhost:5173`                  | Frontend origin (for CORS)   |

Start the backend:

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.

### API Endpoints

| Method | Endpoint        | Description                  |
|--------|-----------------|------------------------------|
| GET    | `/api/health`   | Health check                 |
| POST   | `/api/contact`  | Submit a contact message     |
| GET    | `/api/contact`  | List all contact messages    |

**POST `/api/contact` body:**
```json
{ "name": "string", "email": "string", "message": "string" }
```

---

## 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

To build for production:

```bash
npm run build
```

---

## Running Both Together

Open two terminals:

```bash
# Terminal 1 – Backend
cd backend && npm run dev

# Terminal 2 – Frontend
cd frontend && npm run dev
```
