# Mowajih AI — Plateforme d'Orientation Intelligente

## Stack
- **Frontend:** React + Vite + TailwindCSS + Axios
- **Backend:** Node.js + Express + Sequelize
- **Database:** MySQL
- **AI:** OpenAI API

## Setup

### 1. Database
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend
```bash
cd server
# Edit .env: set DB_PASSWORD and OPENAI_API_KEY
npm run dev
```

### 3. Frontend
```bash
cd client
npm run dev
```

## Test Accounts (password: `password`)
| Role | Email |
|------|-------|
| Étudiant | yassine@test.ma |
| Parent | parent@test.ma |
| Professeur | hassan@test.ma |
| Admin | admin@mowajih.ma |

## API
- `POST /api/auth/login` — Login
- `GET  /api/eleves/:id/notes` — Notes
- `POST /api/roadmap/generate` — AI Roadmap
- `POST /api/chatbot/message` — AI Chat
