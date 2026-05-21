# MyTawjeh – AI Academic Orientation Platform

A comprehensive MERN stack web application for intelligent academic orientation for Moroccan students, featuring user management, grade tracking, and AI-powered guidance.

## 📁 Project Structure

```
mytawjihi_project/
├── backend/          # Express + MongoDB (Mongoose) backend
├── frontend/         # React + Vite + Tailwind frontend
├── mowajih-ai/       # AI-powered orientation module (MySQL + OpenAI)
├── README.md         # This file
└── backend.log        # Backend logs
```

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally **or** a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string
- For AI features: MySQL and OpenAI API key

---

## 🔧 1. Backend Setup (MongoDB)

```bash
cd backend
npm install
```

Copy the example env file and fill in your values:

```bash
copy .env.example .env
```

### `.env` variables:

| Variable    | Default                                  | Description                  |
|-------------|------------------------------------------|------------------------------|
| `PORT`      | `5000`                                   | Port the server listens on   |
| `MONGO_URI` | `mongodb://localhost:27017/mytawjeh`     | MongoDB connection string    |
| `CLIENT_URL`| `http://localhost:5173`                  | Frontend origin (for CORS)   |
| `JWT_SECRET`| `mytawjeh_jwt_secret_dev`                | JWT secret for authentication |

Start the backend:

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.

### 📡 API Endpoints

| Method | Endpoint        | Description                  | Authentication |
|--------|-----------------|------------------------------|---------------|
| GET    | `/api/health`   | Health check                 | ❌ No          |
| POST   | `/api/contact`  | Submit a contact message     | ❌ No          |
| GET    | `/api/contact`  | List all contact messages    | ❌ No          |
| POST   | `/api/auth/register` | User registration        | ❌ No          |
| POST   | `/api/auth/login`    | User login               | ❌ No          |
| GET    | `/api/auth/me`       | Get current user profile | ✅ Yes         |
| PUT    | `/api/auth/profile`  | Update user profile     | ✅ Yes         |
| GET    | `/api/notes`        | Get all notes for user  | ✅ Yes         |
| POST   | `/api/notes`        | Create a new note        | ✅ Yes         |
| PUT    | `/api/notes/:id`    | Update a note           | ✅ Yes         |
| DELETE | `/api/notes/:id`    | Delete a note           | ✅ Yes         |

**POST `/api/contact` body:**
```json
{ "name": "string", "email": "string", "message": "string" }
```

**POST `/api/auth/register` body:**
```json
{
  "email": "string",
  "password": "string",
  "role": "etudiant|professeur|parent",
  "nom": "string",
  "prenom": "string",
  "telephone": "string",
  "adresse": "string",
  "ville": "string",
  "cin": "string",
  "dateNaissance": "date",
  "sexe": "Masculin|Féminin",
  "username": "string",
  "cne": "string", // student only
  "numeroEtudiant": "string", // student only
  "filiere": "string", // student only
  "niveau": "string", // student only
  "groupe": "string", // student only
  "anneeScolaire": "string", // student only
  "dateInscription": "date", // student only
  "matricule": "string", // professor only
  "specialite": "string", // professor only
  "departement": "string", // professor only
  "niveauEnseigne": "string", // professor only
  "dateEmbauche": "date", // professor only
  "diplome": "string", // professor only
  "experience": "number", // professor only
  "profession": "string", // parent only
  "nomEnfant": "string", // parent only
  "relation": "string" // parent only
}
```

---

## 🖥️ 2. Frontend Setup (React + Vite + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Key Frontend Components

- **AuthContext.tsx**: Authentication state management with React Context
- **api.ts**: API client with JWT token handling
- **App.tsx**: Main application component
- **NewsPage.tsx**: News page with language support
- **Connexion.jsx**: Login page
- **Inscription.jsx**: Registration page

### Features

- ✅ User authentication (login/register)
- ✅ Role-based access (student, teacher, parent)
- ✅ Grade/note management
- ✅ Profile management
- ✅ Contact form
- ✅ Multi-language support (French/Arabic)
- ✅ Responsive design with Tailwind CSS

---

## 🤖 3. Mowajih AI Module (Optional)

The `mowajih-ai/` directory contains an additional AI-powered orientation system using MySQL and OpenAI API.

### Setup

1. **Database:**
```bash
mysql -u root -p < database/schema.sql
```

2. **Backend:**
```bash
cd server
# Edit .env: set DB_PASSWORD and OPENAI_API_KEY
npm run dev
```

3. **Frontend:**
```bash
cd client
npm run dev
```

### AI Features

- ✅ AI-powered academic roadmap generation
- ✅ Intelligent chatbot for student guidance
- ✅ Student performance analysis
- ✅ Personalized recommendations

### Test Accounts (password: `password`)

| Role       | Email               |
|------------|---------------------|
| Student    | yassine@test.ma     |
| Parent     | parent@test.ma      |
| Teacher    | hassan@test.ma      |
| Admin      | admin@mowajih.ma    |

### AI API Endpoints

- `POST /api/auth/login` — Login
- `GET  /api/eleves/:id/notes` — Get student notes
- `POST /api/roadmap/generate` — Generate AI roadmap
- `POST /api/chatbot/message` — AI chatbot interaction

---

## 🔄 Running Both Together

Open two terminals:

```bash
# Terminal 1 – Backend
cd backend && npm run dev

# Terminal 2 – Frontend
cd frontend && npm run dev
```

---

## 🧪 Testing the Backend-Frontend Connection

### Connection Status: ✅ CONNECTED

The backend and frontend are properly connected through:

1. **Backend Configuration**:
   - CORS middleware configured with `CLIENT_URL` from environment variables
   - API routes properly defined: `/api/auth`, `/api/notes`, `/api/contact`
   - Server runs on port 5000 by default

2. **Frontend API Client**:
   - Points to `http://localhost:5000/api`
   - Implements JWT authentication with token storage
   - Includes all necessary API endpoints matching backend routes

3. **Environment Configuration**:
   - Backend `.env.example` shows `CLIENT_URL=http://localhost:5173`
   - Frontend runs on port 5173 (Vite default)

### Testing Instructions

**1. Start the Backend:**
```bash
cd backend
cd backend
copy .env.example .env
npm run dev
```

**2. Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**3. Test the Connection:**
- Open browser to `http://localhost:5173`
- Try registering a new user or logging in
- Test API endpoints using the frontend interface
- Check browser console for any CORS or network errors

**4. Manual API Testing:**
Test the backend directly using curl or Postman:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test contact form
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello"}'
```

**5. Authentication Testing:**
```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password","role":"etudiant","nom":"Test","prenom":"User"}'

# Login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Troubleshooting

**Common Issues and Solutions:**

1. **CORS Errors**:
   - Ensure `CLIENT_URL` in backend `.env` matches frontend URL
   - Check backend is running and accessible

2. **Connection Refused**:
   - Verify MongoDB is running (for backend)
   - Check both backend and frontend are started

3. **Authentication Failures**:
   - Verify JWT secret is set in backend `.env`
   - Check token is being stored/retrieved properly in frontend

4. **API Endpoint Not Found**:
   - Double-check route definitions in backend
   - Verify frontend API calls use correct endpoints

**Debugging Tips:**
- Check backend logs in `backend/backend.log`
- Use browser developer tools (Network tab) to inspect API calls
- Test endpoints directly with Postman or curl
- Verify MongoDB connection string in `.env` file

## 📦 Technology Stack

### Backend
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Mongoose schema validation
- **Security**: bcrypt for password hashing, CORS

### Frontend
- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Routing**: React Router v7
- **Type Safety**: TypeScript
- **Utilities**: clsx, tailwind-merge

### AI Module
- **Backend**: Node.js + Express + Sequelize
- **Database**: MySQL
- **AI Integration**: OpenAI API
- **Frontend**: React + Vite + Axios

---

## 📂 Database Models

### User Model (MongoDB)
Comprehensive user model supporting three roles:

- **Student**: Academic information (CNE, student ID, field of study, level, etc.)
- **Teacher**: Professional information (employee ID, specialty, department, etc.)
- **Parent**: Family information (profession, child's name, relationship)

### Note Model (MongoDB)
- `userId`: Reference to user
- `matiere`: Subject name
- `valeur`: Grade value (0-20)
- `coefficient`: Weight (default: 1)
- `periode`: Academic period
- `type`: Control/Exam/Homework/Project/Other

### Contact Model (MongoDB)
- `name`: Contact name
- `email`: Contact email
- `message`: Message content
- `timestamps`: Creation date

---

## 🔐 Authentication Flow

1. **Registration**: User provides email, password, role, and profile details
2. **Login**: Email/password authentication with JWT token
3. **Protected Routes**: JWT token required in Authorization header
4. **Profile Management**: Update user information

---

## 🎯 Key Features

### For Students
- Track academic grades and performance
- View personalized recommendations
- Access orientation resources
- Contact support

### For Teachers
- Monitor student performance
- Provide academic guidance
- Access teaching resources

### For Parents
- Track child's academic progress
- Communicate with educators
- Access parenting resources

### For Administrators
- Manage user accounts
- View contact messages
- Generate reports

---

## 🛠️ Development Notes

### Environment Variables
- Create `.env` files in both `backend/` and `mowajih-ai/server/` directories
- Never commit sensitive information to version control

### Code Style
- Backend: CommonJS modules
- Frontend: ES Modules with TypeScript
- Consistent indentation and formatting

### Error Handling
- Comprehensive try/catch blocks
- Meaningful error messages
- Proper HTTP status codes

---

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm install --production
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Serve the dist/ directory with your preferred web server
```

### Docker (Recommended)
Create Dockerfiles for both backend and frontend services, then use docker-compose for orchestration.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

---

## 📝 License

This project is open source and available under the MIT License.

---

## 📞 Support

For issues, questions, or suggestions:
- Open a GitHub issue
- Contact the maintainers via email
- Use the contact form in the application

---

**MyTawjeh** © 2026 - Intelligent Academic Orientation for Moroccan Students