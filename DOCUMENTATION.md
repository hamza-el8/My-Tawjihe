# 🎓 MyTawjeh — Plateforme d'Orientation Académique par IA

**MyTawjeh** is an intelligent academic orientation platform for Moroccan students. It combines school performance tracking, RIASEC (O\*NET) career testing, AI-generated roadmaps, a pedagogical chatbot, and a guide to higher education opportunities in Morocco.

---

## 📁 Project Structure

```
Mytawjeh/
├── frontend/                          # React + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/                # Reusable React components
│   │   ├── dashboard/                 # Dashboard pages & widgets (role-based)
│   │   ├── translations/              # i18n (French & Arabic)
│   │   ├── utils/                     # Utility functions
│   │   ├── App.tsx                    # Main app (landing page + auth + routing)
│   │   ├── Dashboard.tsx              # Dashboard shell (sidebar, header, routing)
│   │   ├── Inscription.tsx/jsx        # Registration page (legacy JSX)
│   │   ├── types.ts                   # Translation & app-wide types
│   │   ├── api.ts                     # API client functions
│   │   ├── index.css                  # Global styles + dashboard CSS
│   │   └── main.tsx                   # Vite entry point
│   ├── public/                        # Static assets (images)
│   ├── dist/                          # Production build output
│   ├── index.html                     # Entry HTML
│   ├── vite.config.ts                 # Vite config (proxy, paths, plugins)
│   └── tsconfig.json                  # TypeScript configuration
│
├── backend/
│   └── server/                        # Express.js REST API
│       ├── config/
│       │   └── db.js                  # SQLite/Sequelize database connection
│       ├── controllers/               # Route handlers (logic layer)
│       ├── middleware/                 # Auth, validation, security, error handling
│       ├── models/                    # Sequelize ORM models
│       ├── routes/
│       │   └── index.js               # All API route definitions
│       ├── services/                  # Business logic services
│       ├── index.js                   # Express app entry point
│       ├── seed.js                    # Database seeder
│       ├── mowajih.sqlite             # SQLite database file
│       └── .env / .env.example        # Environment configuration
│
├── scripts/
│   └── extract-translations.js        # Translation extraction utility
├── package.json                       # Workspace root (concurrently for dev)
└── README.md                          # Project overview
```

---

## 🧩 Frontend Architecture

### Tech Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.6 | UI framework |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.3.2 | Build tool & dev server |
| Tailwind CSS | 4.1.17 | Utility-first CSS |
| React Router DOM | 7.15.1 | Client-side routing |
| clsx | 2.1.1 | Conditional class names |
| tailwind-merge | 3.4.0 | Tailwind class merging |

### Dev Dependencies
| Package | Purpose |
|---------|---------|
| `@vitejs/plugin-react` | React Fast Refresh for Vite |
| `@tailwindcss/vite` | Tailwind CSS Vite plugin |
| `vite-plugin-singlefile` | Bundle to single file (optional) |
| `typescript` | TypeScript compiler |
| `eslint` + `prettier` | Code quality & formatting |


## 📦 Key Features Summary

| Feature | Frontend | Backend | Description |
|---------|----------|---------|-------------|
| 🎓 Role-based access | `Dashboard.tsx` + 4 role dashboards | `auth.js` middleware | 4 roles: eleve, parent, professeur, admin |
| 📊 Grade tracking | `NotesPage.tsx` + `NotesEvolutionChart.tsx` | `notesController.js` | CRUD grades with weighted averages |
| 🧭 AI Roadmap | `RoadmapPage.tsx` | `aiController.js` + OpenAI | Career path generation |
| 🤖 Chatbot | `ChatbotPage.tsx` | `aiController.js` + OpenAI | Pedagogical assistant |
| 🎯 O\*NET Test | `OnetTest.tsx` + `MonProfilPage.tsx` | `authController.js` | RIASEC career assessment (60 Qs) |
| 📝 Exercises | `ExercicesPage.tsx` | `exercicesController.js` | Create, filter, submit exercises |
| 🏆 Concours | `ConcoursPage.tsx` | `concoursController.js` | Competition listings |
| 🔔 Notifications | `NotificationsPage.tsx` | `notificationsController.js` | Push notifications |
| 🌍 i18n | `translations/` (fr + ar) | — | Full bilingual + RTL support |
| 📱 Responsive | Tailwind breakpoints | — | Mobile-first with sidebar overlay |
| 🔒 Security | Token in localStorage | Helmet + rate limiting + JWT | Password hashing, CORS, rate limits |

---

## 🔧 Recent Fixes

| Commit | File | Fix |
|--------|------|-----|
| `c241fa4` | `Sidebar.tsx` | Fixed `useRef` render-time mutation bug — replaced with IIFE + local variable |
| `c241fa4` | `shared.ts` | Removed deprecated misspelled `datw` field from `Concours` interface |
| `c241fa4` | `ParentDashboard.tsx` | Refactored unsafe `[] as unknown as [any, any]` promise chain |
| `c241fa4` | `EleveDashboard.tsx` | Added loading state for exercices count (null vs 0) |

---

## 📄 License & Author

- **Author**: hamza-el8
- **Repository**: [github.com/hamza-el8/My-Tawjihe](https://github.com/hamza-el8/My-Tawjihe.git)
- **Version**: 6.1


## ⚙️ Configuration

### Environment Variables

**Frontend** (`.env`)
```
VITE_API_URL=http://localhost:5000/api    # Optional, defaults to localhost:5000/api
```

**Backend** (`.env`)
```
PORT=5000                                 # Server port
JWT_SECRET=change_this_to_a_random_secret # JWT signing secret
OPENAI_API_KEY=sk-your-openai-key-here   # OpenAI API key for AI features
CLIENT_URL=http://localhost:5173          # CORS allowed origin
```

### Vite Dev Server Proxy
The `/api` prefix is proxied to `http://localhost:5000` during development, eliminating CORS issues.

---

## 🚀 Running the Project

### Prerequisites
- Node.js 18+
- npm

### Quick Start
```bash
# Install all dependencies
cd frontend && npm install
cd backend/server && npm install
cd ../..

# Start both servers concurrently
npm run dev

# Or start individually:
npm run dev:backend   # Express on :5000
npm run dev:frontend  # Vite on :5173

# Seed the database
npm run seed
```

### Production Build
```bash
cd frontend && npm run build
# Output in frontend/dist/
```


## 🎨 Dashboard CSS Architecture

All dashboard styles are in `frontend/src/index.css` under the `DASHBOARD — Premium redesign` section.

### CSS Class Hierarchy
```
dash-shell               → Main flex container
├── dash-sidebar          → Dark sidebar with noise texture & glow
│   ├── dash-sidebar-logo → App logo area
│   ├── dash-sidebar-profile → User profile (ProfilePopup)
│   ├── dash-sidebar-nav  → Navigation menu
│   │   ├── dash-nav-item → Menu button (with .active state)
│   │   ├── dash-nav-section → Category section header
│   │   └── nav-dot       → Active indicator dot
│
└── dash-main             → Main content area
    ├── dash-header       → Sticky top bar with glassmorphism
    ├── dash-content      → Scrollable page content
    ├── dash-hero         → Gradient hero banner
    ├── dash-card / dash-card-flat → Premium cards with blur
    ├── dash-stat         → Statistics card (icon + value + label)
    ├── dash-table        → Data table
    ├── dash-tabs / dash-tab → Tab navigation
    ├── dash-input        → Form input
    ├── dash-btn          → Button variants (primary, ghost)
    ├── dash-badge        → Status badges (purple/green/red/amber/blue)
    ├── dash-empty        → Empty state
    ├── dash-progress     → Progress bars
    ├── dash-skeleton     → Loading skeleton
    └── dash-page-enter   → Page fade-in animation
```

### Design Tokens
| Token | Value |
|-------|-------|
| Primary | `#7c3aed` (violet-600) |
| Primary gradient | `linear-gradient(135deg, #7c3aed, #a855f7)` |
| Dark sidebar bg | `#0f0c29` → `#1e1540` → `#16122e` |
| Card bg | `rgba(255,255,255,0.92)` with backdrop blur |
| Border radius | `18px` (cards), `10px` (nav/inputs) |
| Base shadow | `0 2px 16px rgba(15,12,41,0.06)` |
| Font | `'Open Sans', sans-serif` |
| RTL font | `'Cairo', 'Open Sans', sans-serif` |


## 🔐 Authentication & Authorization

### Flow
1. **Register** → Backend auto-detects role from fields provided
2. **Login** → Returns JWT token + user object
3. **Client** → Stores token in `localStorage`
4. **API calls** → `Authorization: Bearer <token>` header
5. **Token expiry** → 401 response → auto-redirect to login

### Middleware Chain
```
Request → securityHeaders (Helmet) → apiLimiter → cors → express.json()
   → authLimiter (/login, /register only) → routes → auth() → controller → errorHandler
```

### Auth Middleware (`middleware/auth.js`)
- Extracts JWT from `Authorization` header
- Verifies with `JWT_SECRET`
- Optional role-based access control: `auth(['admin'])`
- Returns 401/403 on failure

### Security (`middleware/security.js`)
- Helmet security headers
- Rate limiting: 5 req/min for auth, 100 req/min for API
- CORS restricted to `CLIENT_URL`


### API Routes (`backend/server/routes/index.js`)

#### 🔓 Public Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user (role auto-detected) |
| POST | `/api/auth/login` | Login, returns JWT + user data |
| POST | `/api/contact` | Contact form submission |

#### 🔒 Protected Routes (require JWT)

**Auth**
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/api/auth/change-password` | All | Change password |
| POST | `/api/auth/link-student` | parent | Link a student to parent account |
| GET | `/api/auth/linked-student` | parent | Get linked student info |
| POST | `/api/onet/save` | eleve | Save O\*NET profile |
| GET | `/api/onet/profile` | eleve | Get O\*NET profile |

**Notes**
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/api/eleves/:id/notes` | All | Get student's notes |
| POST | `/api/notes` | All | Add a note |
| DELETE | `/api/notes/:id` | All | Delete a note |

**Exercises**
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/api/exercices` | All | List/filter exercises |
| POST | `/api/exercices` | prof, admin | Create exercise |
| POST | `/api/exercices/:id/submit` | eleve | Submit exercise result |
| GET | `/api/exercices/resultats/:eleveId` | All | Get exercise results |

**AI**
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/api/roadmap/:eleveId` | All | Get saved roadmap |
| POST | `/api/roadmap/generate` | eleve | Generate AI roadmap |
| POST | `/api/chatbot/message` | All | Send message to AI chatbot |

**Concours & Annales**
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/api/concours` | All | List competitions |
| POST | `/api/concours` | admin | Create competition |
| GET | `/api/annales` | All | List exam archives |
| POST | `/api/annales` | admin | Create exam archive |

**Notifications**
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/api/notifications/:eleveId` | All | Get notifications |
| POST | `/api/notifications` | admin, prof | Send notification |
| PATCH | `/api/notifications/:id/read` | All | Mark notification as read |

**Teacher**
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/api/prof/eleves-faibles` | prof | Get struggling students |
| GET | `/api/prof/stats` | prof | Get teacher statistics |
| POST | `/api/prof/services` | prof | Post service offering |

**Admin**
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/api/admin/users` | admin | List all users |
| DELETE | `/api/admin/users/:role/:id` | admin | Delete a user |


## 🗄️ Backend Architecture

### Tech Stack
| Technology | Purpose |
|------------|---------|
| Node.js + Express 5 | REST API server |
| Sequelize 6 | ORM for database |
| SQLite3 | Database engine (file-based) |
| MySQL2 | Optional MySQL driver (for production) |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| OpenAI | AI chatbot & roadmap generation |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |
| cors | Cross-origin resource sharing |
| dotenv | Environment variables |

### Database Models (`backend/server/models/`)

| Model | File | Fields | Relationships |
|-------|------|--------|---------------|
| **Eleve** | `Eleve.js` | id, nom, email, motDePasse, niveau, filiere, ville | → Notes, Resultats, Roadmaps, Notifications, Parent |
| **Parent** | `Parent.js` | id, nom, email, motDePasse, eleveId | → Eleve (belongsTo) |
| **Professeur** | `Professeur.js` | id, nom, email, motDePasse, specialite | → Exercices |
| **Admine** | `Admine.js` | id, nom, email, motDePasse | → Notifications |
| **Note** | `Note.js` | id, matiere, valeur, coefficient, periode, type, eleveId | → Eleve |
| **Exercice** | `Exercice.js` | id, matiere, niveau, difficulte, contenu, correction, professeurId | → Resultats, Professeur |
| **ResultatExercice** | `ResultatExercice.js` | id, score, eleveId, exerciceId | → Eleve, Exercice |
| **Roadmap** | `Roadmap.js` | id, contenu (JSON), eleveId, metierId | → Eleve, Metier |
| **Metier** | `Metier.js` | id, nom, description, codeOnet | → Roadmaps |
| **Concours** | `Concours.js` | id, nom, seuil, dateConcours, lien, description | → Annales |
| **Annale** | `Annale.js` | id, matiere, annee, contenu, correction, concoursId | → Concours |
| **Notification** | `Notification.js` | id, contenu, type, lu, eleveId, admineId | → Eleve, Admine |
| **ProfilOnet** | `ProfilOnet.js` | id, primaryInterest, secondaryInterest, tertiaryInterest, eleveId | → Eleve |

### Entity-Relationship Diagram

```
Parent (1) ────→ (1) Eleve (1) ────→ (many) Note
                              ├──→ (many) ResultatExercice
                              ├──→ (many) Roadmap ──→ (1) Metier
                              └──→ (many) Notification ←── (1) Admine
Professeur (1) ──→ (many) Exercice ──→ (many) ResultatExercice
Concours (1) ──→ (many) Annale
```


### 📑 Other Pages

| Page | File | Description |
|------|------|-------------|
| Notes | `NotesPage.tsx` | Grade management with evolution chart, add/delete notes |
| Exercises | `ExercicesPage.tsx` | Browse, filter, and solve exercises |
| Roadmap | `RoadmapPage.tsx` | AI-generated career roadmap |
| Chatbot | `ChatbotPage.tsx` | AI pedagogical assistant |
| Concours | `ConcoursPage.tsx` | Browse competitions and scholarships |
| Notifications | `NotificationsPage.tsx` | View and manage notifications |
| Mon Profil O\*NET | `MonProfilPage.tsx` | O\*NET career profile and test results |
| Actualités | `ActualitesPage.tsx` | Education news feed |

### 🧩 Shared Dashboard Components

| Component | File | Purpose |
|-----------|------|---------|
| Sidebar | `Sidebar.tsx` | Navigation with role-based menu, section grouping, active state |
| Header | `Layout.tsx` | Top bar with title, subtitle, notification badge, online indicator |
| StatCard | `Layout.tsx` | Dashboard statistics card with icon, value, label |
| ProfilePopup | `ProfilePopup.tsx` | User profile dropdown with password change, student linking, O\*NET retake |
| NotesEvolutionChart | `NotesEvolutionChart.tsx` | SVG chart showing grade trends per subject |
| OnetTest | `OnetTest.tsx` | RIASEC career interest test (60 questions) |

### 🌍 Landing Page Components

| Component | File | Purpose |
|-----------|------|---------|
| AIEcosystem | `components/AIEcosystem.tsx` | Features showcase for students/parents/teachers |
| SmartChatbot | `components/SmartChatbot.tsx` | Embedded FAQ chatbot for landing page |
| WorldMapPage | `components/WorldMapPage.tsx` | Map showing study destinations worldwide |
| ErrorBoundary | `components/ErrorBoundary.tsx` | React error boundary with reload button |

### 🌐 Internationalization
| File | Language | Lines |
|------|----------|-------|
| `translations/fr.ts` | French | ~2200 lines |
| `translations/ar.ts` | Arabic | RTL support |
| `translations/index.ts` | Barrel export | Language switching |


## 🖥️ Frontend Components & Pages

### 📄 Main App (`App.tsx`)
- **Landing page** with hero, features, AI ecosystem, news, testimonials, contact
- **Authentication** - Login form and registration (`Inscription.jsx`)
- **Role-based dashboard** - Routes authenticated users to `Dashboard.tsx`
- **Localization** - French (`fr`) / Arabic (`ar`) with RTL support
- **Error handling** via `ErrorBoundary` component

### 🧭 Dashboard System (`Dashboard.tsx`)
- **Role-based rendering**: `eleve` | `professeur` | `admin` | `parent`
- **Layout**: Sidebar + Header + Content area
- **Responsive**: Mobile hamburger menu with overlay

### 📊 Role-Specific Dashboards

#### 🎓 Student (`EleveDashboard.tsx`)
| Feature | Description |
|---------|-------------|
| Hero banner | Personalized welcome with O\*NET profile badge |
| Stats cards | Average grade, notes count, exercises done, unread notifications |
| Quick actions | Notes, Roadmap IA, Assistant IA, Exercises |
| Recent notes | Latest 4 grades with color-coded scores (green/blue/red) |
| O\*NET prompt | Popup to take career test if not yet completed |
| Notification count | Fetched from API for stat card display |

#### 👨‍🏫 Teacher (`ProfDashboard.tsx`)
| Feature | Description |
|---------|-------------|
| Stats | Students in difficulty, submissions received, below 10/20 count |
| Students tab | Table of struggling students with name, level, major, average |
| Submissions tab | Exercise results from students |
| Create exercise tab | Form to create new exercises (subject, level, difficulty, content, correction) |

#### ⚙️ Admin (`AdminDashboard.tsx`)
| Feature | Description |
|---------|-------------|
| Stats | Total students, teachers, parents |
| Users tab | Search, view, and delete users by role |
| Notifications tab | Send individual or bulk notifications to students |
| Exercises tab | CRUD for exercises with search & pagination |
| Annales tab | CRUD for exam archives with search & pagination |
| Concours tab | CRUD for competitions/scholarships with search & pagination |

#### 👪 Parent (`ParentDashboard.tsx`)
| Feature | Description |
|---------|-------------|
| Hero banner | Parent space greeting |
| Linked student card | Shows linked child's name, email, level, major, average |
| Stats | Average, notes count, alert count |
| Low-grade alerts | Warning banner for subjects below 10/20 |
| Notes table | All student grades with color-coded scores |
| Notifications tab | Student notifications visible to parent |
