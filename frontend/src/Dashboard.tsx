import { useState, useEffect } from 'react';
import { Notification, apiFetch } from './dashboard/shared';
import { useAuth } from './AuthContext';
import OnetTest from './dashboard/OnetTest';
import Sidebar from './dashboard/Sidebar';
import { Header } from './dashboard/Layout';
import NotesPage from './dashboard/NotesPage';
import ChatbotPage from './dashboard/ChatbotPage';
import RoadmapPage from './dashboard/RoadmapPage';
import ExercicesPage from './dashboard/ExercicesPage';
import ConcoursPage from './dashboard/ConcoursPage';
import NotificationsPage from './dashboard/NotificationsPage';
import EleveDashboard from './dashboard/EleveDashboard';
import ProfDashboard from './dashboard/ProfDashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import ParentDashboard from './dashboard/ParentDashboard';
import ActualitesPage from './dashboard/ActualitesPage';
import MonProfilPage from './dashboard/MonProfilPage';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [showOnetTest, setShowOnetTest] = useState(false);

  useEffect(() => {
    if (!user) return;

    if (user.role === 'eleve') {
      apiFetch(`/notifications/${user.id}`)
        .then((ns: Notification[]) => setNotifCount(ns.filter(n => !n.lu).length))
        .catch(() => {});
      return;
    }

    if (user.role === 'parent') {
      apiFetch('/auth/linked-student')
        .then(async (r) => {
          const eleveId = r?.eleve?.id;
          if (eleveId) {
            const ns: Notification[] = await apiFetch(`/notifications/${eleveId}`);
            setNotifCount(ns.filter(n => !n.lu).length);
          } else {
            setNotifCount(0);
          }
        })
        .catch(() => setNotifCount(0));
    }
  }, [user?.id, user?.role]);

  if (!user) return null;

  if (showOnetTest) {
    return <OnetTest onComplete={() => setShowOnetTest(false)} onSkip={() => setShowOnetTest(false)} />;
  }

  const handleRetakeOnet = () => setShowOnetTest(true);

  const pageTitles: Record<string, { title: string; subtitle?: string }> = {
    dashboard:     { title: 'Tableau de bord',        subtitle: `Bienvenue, ${user.nom}` },
    profil:        { title: 'Mon Profil O*NET',        subtitle: 'Vos intérêts et recommandations de carrière' },
    actualites:    { title: 'Actualités',              subtitle: 'Éducation et orientation au Maroc' },
    notes:         { title: 'Mes Notes',               subtitle: 'Gérez vos résultats scolaires' },
    exercices:     { title: 'Exercices',               subtitle: 'Entraînez-vous et progressez' },
    roadmap:       { title: 'Roadmap Professionnel',   subtitle: 'Votre parcours personnalisé par IA' },
    chatbot:       { title: 'Assistant Mowajih IA',    subtitle: 'Posez vos questions' },
    concours:      { title: 'Concours & Bourses',      subtitle: 'Opportunités disponibles' },
    annales:       { title: 'Annales',                 subtitle: 'Examens et sujets passés' },
    notifications: { title: 'Notifications',           subtitle: 'Vos alertes et messages' },
    eleves:        { title: 'Élèves en difficulté',    subtitle: 'Suivi pédagogique' },
    users:         { title: 'Gestion utilisateurs',    subtitle: 'Administration plateforme' },
    suivi:         { title: 'Suivi de mon élève',      subtitle: 'Résultats et progression' },
  };

  const renderPage = () => {
    if (user.role === 'eleve') {
      switch (active) {
        case 'dashboard':     return <EleveDashboard user={user} setActive={setActive} onRetakeOnet={handleRetakeOnet} notifCount={notifCount} />;
        case 'profil':        return <MonProfilPage user={user} onRetakeOnet={handleRetakeOnet} />;
        case 'actualites':    return <ActualitesPage />;
        case 'notes':         return <NotesPage user={user} />;
        case 'exercices':     return <ExercicesPage user={user} />;
        case 'roadmap':       return <RoadmapPage user={user} />;
        case 'chatbot':       return <ChatbotPage user={user} />;
        case 'concours':      return <ConcoursPage />;
        case 'annales':       return <ConcoursPage initialTab="annales" />;
        case 'notifications': return <NotificationsPage user={user} onUpdateCount={setNotifCount} />;
      }
    }
    if (user.role === 'professeur') {
      switch (active) {
        case 'dashboard':     return <ProfDashboard user={user} />;
        case 'eleves':        return <ProfDashboard user={user} initialTab="eleves" />;
        case 'exercices':     return <ExercicesPage user={user} />;
        case 'notifications': return <NotificationsPage user={user} />;
      }
    }
    if (user.role === 'admin') {
      switch (active) {
        case 'dashboard':     return <AdminDashboard user={user} />;
        case 'users':         return <AdminDashboard user={user} />;
        case 'concours':      return <ConcoursPage />;
        case 'notifications': return <NotificationsPage user={user} />;
      }
    }
    if (user.role === 'parent') {
      if (active === 'actualites') return <ActualitesPage />;
      return <ParentDashboard user={user} />;
    }
    return <div style={{ padding: 24, color: '#94a3b8' }}>Page en construction...</div>;
  };

  const current = pageTitles[active] || { title: active };

  return (
    <div className="dash-shell">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar user={user} active={active} setActive={setActive} onLogout={logout} onRetakeOnet={handleRetakeOnet} />
      </div>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }} className="lg:hidden">
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: 'relative', width: 280, height: '100%' }}>
            <Sidebar user={user} active={active} setActive={setActive} onLogout={logout} mobile onClose={() => setSidebarOpen(false)} onRetakeOnet={handleRetakeOnet} />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="dash-main">
        <Header
          title={current.title}
          subtitle={current.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          notifCount={notifCount}
        />
        <div className="dash-content dash-page-enter">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
