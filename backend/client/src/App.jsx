import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import EleveDashboard from './pages/eleve/EleveDashboard';
import NotesPage from './pages/eleve/NotesPage';
import ExercicesPage from './pages/eleve/ExercicesPage';
import RoadmapPage from './pages/eleve/RoadmapPage';
import ChatbotPage from './pages/eleve/ChatbotPage';
import ConcoursPage from './pages/eleve/ConcoursPage';
import AnnalesPage from './pages/eleve/AnnalesPage';
import NotificationsPage from './pages/eleve/NotificationsPage';
import ParentDashboard from './pages/parent/ParentDashboard';
import ProfDashboard from './pages/prof/ProfDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function Guard({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={`/${user.role === 'admin' ? 'admin' : user.role === 'professeur' ? 'prof' : user.role}`} /> : <LoginPage />} />
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Eleve */}
      <Route path="/eleve" element={<Guard roles={['eleve']}><EleveDashboard /></Guard>} />
      <Route path="/eleve/notes" element={<Guard roles={['eleve']}><NotesPage /></Guard>} />
      <Route path="/eleve/exercices" element={<Guard roles={['eleve']}><ExercicesPage /></Guard>} />
      <Route path="/eleve/roadmap" element={<Guard roles={['eleve']}><RoadmapPage /></Guard>} />
      <Route path="/eleve/chatbot" element={<Guard roles={['eleve']}><ChatbotPage /></Guard>} />
      <Route path="/eleve/concours" element={<Guard roles={['eleve']}><ConcoursPage /></Guard>} />
      <Route path="/eleve/annales" element={<Guard roles={['eleve']}><AnnalesPage /></Guard>} />
      <Route path="/eleve/notifications" element={<Guard roles={['eleve']}><NotificationsPage /></Guard>} />

      {/* Parent */}
      <Route path="/parent" element={<Guard roles={['parent']}><ParentDashboard /></Guard>} />
      <Route path="/parent/notes" element={<Guard roles={['parent']}><ParentDashboard /></Guard>} />

      {/* Prof */}
      <Route path="/prof" element={<Guard roles={['professeur']}><ProfDashboard /></Guard>} />
      <Route path="/prof/eleves-faibles" element={<Guard roles={['professeur']}><ProfDashboard /></Guard>} />
      <Route path="/prof/exercices" element={<Guard roles={['professeur']}><ProfDashboard /></Guard>} />

      {/* Admin */}
      <Route path="/admin" element={<Guard roles={['admin']}><AdminDashboard /></Guard>} />
      <Route path="/admin/users" element={<Guard roles={['admin']}><AdminDashboard /></Guard>} />
      <Route path="/admin/notifications" element={<Guard roles={['admin']}><AdminDashboard /></Guard>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
