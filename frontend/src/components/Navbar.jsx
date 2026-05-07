import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Calendar, LayoutDashboard, MapPin, User, Users, LogOut, Shield } from 'lucide-react';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <nav className="backdrop-blur-md bg-background/60 border-b border-glass-border sticky top-0 z-50 py-4 mb-12">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-2xl font-black bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-none hover:scale-105 transition-transform">
          <Calendar className="text-primary h-8 w-8 shrink-0" />
          <span>CampusEvents</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          <NavLink to="/" end className={({ isActive }) => `nav-link flex items-center gap-2 font-semibold ${isActive ? 'active text-primary' : ''}`}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => `nav-link flex items-center gap-2 font-semibold ${isActive ? 'active text-primary' : ''}`}>
            <Calendar size={18} />
            Events
          </NavLink>
          {user?.role === 'ADMIN' && (
            <>
              <NavLink to="/admin" end className={({ isActive }) => `nav-link flex items-center gap-2 font-semibold ${isActive ? 'active text-primary' : ''}`}>
                <Shield size={18} />
                Admin
              </NavLink>
              <NavLink to="/admin/users" className={({ isActive }) => `nav-link flex items-center gap-2 font-semibold ${isActive ? 'active text-primary' : ''}`}>
                <Users size={18} />
                Users
              </NavLink>
            </>
          )}
          <NavLink to="/resources" className={({ isActive }) => `nav-link flex items-center gap-2 font-semibold ${isActive ? 'active text-primary' : ''}`}>
            <MapPin size={18} />
            Resources
          </NavLink>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-sm font-bold text-text">{user.name}</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">{user.role}</span>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-surface flex items-center justify-center border border-glass-border shadow-inner">
                <User size={22} className="text-primary" />
              </div>
              <button 
                onClick={() => { localStorage.removeItem('user'); window.location.reload(); }}
                className="h-11 w-11 rounded-2xl bg-error/10 hover:bg-error/20 flex items-center justify-center text-error transition-all border border-error/20"
                title="Logout"
              >
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary py-2 px-6 text-sm shadow-none">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
