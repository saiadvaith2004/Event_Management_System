import React, { useEffect, useState } from 'react';
import { eventApi, userApi } from '../api';
import { CheckCircle, XCircle, Trash2, Calendar, User, MapPin, Clock, AlertCircle, Shield, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [pendingUsersCount, setPendingUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [eventsRes, usersRes] = await Promise.all([
        eventApi.listAll(),
        userApi.listPending()
      ]);
      setEvents(eventsRes.data);
      setPendingUsersCount(usersRes.data.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await eventApi.approve(id);
      fetchEvents();
    } catch (err) {
      alert('Failed to approve event');
    }
  };

  const handleReject = async (id) => {
    try {
      await eventApi.reject(id);
      fetchEvents();
    } catch (err) {
      alert('Failed to reject event');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventApi.delete(id);
        fetchEvents();
      } catch (err) {
        alert('Failed to delete event');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-success/20 text-success border-success/20';
      case 'REJECTED': return 'bg-error/20 text-error border-error/20';
      default: return 'bg-primary/20 text-primary border-primary/20';
    }
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-text-muted text-lg">Manage and moderate campus event requests.</p>
        </div>
        <div className="glass-card py-3 px-6 flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
          <span className="font-bold text-sm uppercase tracking-widest text-primary">Live Moderation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Link to="/admin/users" className="glass-card flex items-center justify-between p-8 group hover:border-primary/40 transition-all">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Shield size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">User Moderation</h3>
              <p className="text-text-muted text-sm font-medium">
                {pendingUsersCount} pending staff registration{pendingUsersCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-surface group-hover:bg-primary/10 group-hover:text-primary transition-all">
            <ArrowRight size={24} />
          </div>
        </Link>
        
        <div className="glass-card flex items-center gap-6 p-8 opacity-60">
          <div className="h-16 w-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
            <Calendar size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">System Logs</h3>
            <p className="text-text-muted text-sm font-medium">Coming soon: platform activities</p>
          </div>
        </div>
      </div>

      <div className="mb-8 flex items-center gap-3">
        <h2 className="text-3xl font-extrabold">Event Requests</h2>
        <span className="badge bg-primary text-white border-none px-3 py-1 text-xs font-black">{events.length}</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {events.length > 0 ? events.map((event) => (
            <div key={event.id} className="group relative p-[1px] rounded-3xl bg-gradient-to-br from-glass-border to-transparent hover:from-primary/30 transition-all duration-500">
              <div className="glass-card bg-[#1e293b]/90 backdrop-blur-2xl rounded-[1.4rem] p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`badge border ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                    <span className="text-text-muted text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                      <Clock size={12} /> {new Date(event.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{event.title}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-text-muted">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-primary" />
                      <span className="font-medium">Organizer: {event.organizer?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-secondary" />
                      <span>Date: {new Date(event.startDatetime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-accent" />
                      <span>Venue: {event.resource?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end lg:self-auto">
                  {event.status === 'PENDING' && (
                    <>
                      <button 
                        onClick={() => handleApprove(event.id)}
                        className="h-12 w-12 rounded-2xl bg-success/10 hover:bg-success/20 text-success transition-all border border-success/20 flex items-center justify-center group/btn"
                        title="Approve"
                      >
                        <CheckCircle size={24} className="group-hover/btn:scale-110 transition-transform" />
                      </button>
                      <button 
                        onClick={() => handleReject(event.id)}
                        className="h-12 w-12 rounded-2xl bg-error/10 hover:bg-error/20 text-error transition-all border border-error/20 flex items-center justify-center group/btn"
                        title="Reject"
                      >
                        <XCircle size={24} className="group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </>
                  )}
                  <div className="h-10 w-[1px] bg-glass-border mx-2" />
                  <button 
                    onClick={() => handleDelete(event.id)}
                    className="h-12 w-12 rounded-2xl bg-surface hover:bg-error/20 text-text-muted hover:text-error transition-all border border-glass-border flex items-center justify-center group/btn"
                    title="Delete"
                  >
                    <Trash2 size={24} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="glass-card text-center py-20">
              <AlertCircle size={48} className="text-text-muted mx-auto mb-4 opacity-20" />
              <p className="text-text-muted text-lg">No event requests found in the system.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
