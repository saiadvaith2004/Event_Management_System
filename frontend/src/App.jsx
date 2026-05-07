import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import EventList from './pages/EventList';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import Login from './pages/Login';
import Register from './pages/Register';
import Resources from './pages/Resources';

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-background text-text">
      {!isAuthPage && <Navbar />}
      <main className={`max-w-7xl mx-auto px-4 ${!isAuthPage ? 'pb-20' : ''}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;


