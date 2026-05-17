import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventApi, registrationApi } from '../api';
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle, XCircle, Save } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [participants, setParticipants] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    eventApi.details(id)
      .then(res => {
        setEvent(res.data);
        if (user && res.data.organizer?.id === user.id) {
          registrationApi.getParticipants(id)
            .then(pRes => setParticipants(pRes.data))
            .catch(err => console.error("Failed to load participants", err));
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id, user?.id]);

  const handleRegister = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
      return;
    }

    setRegistering(true);
    registrationApi.register(id, storedUser)
      .then(() => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch(err => alert('Registration failed: ' + err.message))
      .finally(() => setRegistering(false));
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this event? The venue will be freed up.')) return;
    setCancelling(true);
    try {
      const res = await eventApi.cancel(id);
      setEvent(res.data);
    } catch (err) {
      alert('Failed to cancel event.');
    } finally {
      setCancelling(false);
    }
  };

  const downloadCSV = () => {
    if (!participants || participants.length === 0) return;
    
    const headers = ['Name', 'Email', 'Department', 'Year of Study', 'Registration Date'];
    
    const csvRows = participants.map(p => {
      const u = p.user;
      return [
        `"${u?.name || ''}"`, 
        `"${u?.email || ''}"`, 
        `"${u?.department || ''}"`, 
        `"${u?.yearOfStudy || ''}"`,
        `"${new Date(p.registrationDate || Date.now()).toLocaleString()}"`
      ].join(',');
    });
    
    const csvString = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}_participants.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="text-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
    </div>
  );

  if (!event) return <div className="text-center py-20">Event not found</div>;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-text mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Events
      </button>

      <div className="glass-card overflow-hidden p-0 mb-8">
        <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-b border-glass-border">
          <Calendar size={80} className="text-primary/40" />
        </div>
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
              <div className="flex flex-wrap gap-6 text-text-muted">
                <div className="flex items-center gap-2">
                  <Calendar className="text-primary" size={20} />
                  <span>{new Date(event.startDatetime).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-secondary" size={20} />
                  <span>{event.resource?.name || 'To be announced'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="text-accent" size={20} />
                  <span>Max {event.maxParticipants} participants</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {event.status === 'CANCELLED' ? (
                <span className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-error/10 text-error border border-error/20 font-bold">
                  <XCircle size={20} /> Event Cancelled
                </span>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering || success}
                  className={`btn-primary px-10 py-4 text-lg flex items-center gap-2 ${success ? 'bg-success shadow-none transform-none' : ''}`}
                >
                  {registering ? 'Processing...' : success ? <><CheckCircle /> Registered!</> : 'Register Now'}
                </button>
              )}
              {user && event.organizer?.id === user.id && event.status !== 'CANCELLED' && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="px-6 py-4 rounded-2xl bg-error/10 hover:bg-error/20 text-error border border-error/20 font-bold transition-all flex items-center gap-2"
                >
                  <XCircle size={20} />
                  {cancelling ? 'Cancelling...' : 'Cancel Event'}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">About this Event</h2>
              <p className="text-text-muted leading-relaxed text-lg">
                {event.description}
              </p>
            </div>
            <div>
              <div className="bg-surface rounded-xl p-6 border border-glass-border">
                <h3 className="font-bold mb-4">Organizer</h3>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {event.organizer?.name?.[0] || 'O'}
                  </div>
                  <div>
                    <p className="font-semibold">{event.organizer?.name || 'Campus Organizer'}</p>
                    <p className="text-xs text-text-muted">{event.club?.name || 'University Club'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {user && event.organizer?.id === user.id && (
        <div className="mt-12 glass-card p-8 animate-slide-up">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Users className="text-primary" /> 
                Registered Participants
              </h2>
              <p className="text-text-muted text-sm mt-1">Manage and export student registration details</p>
            </div>
            <button 
              onClick={downloadCSV}
              disabled={participants.length === 0}
              className="px-6 py-3 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 font-bold transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={18} /> Download CSV
            </button>
          </div>
          
          {participants.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-glass-border">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface/50">
                  <tr>
                    <th className="p-4 font-semibold text-sm">Name</th>
                    <th className="p-4 font-semibold text-sm">Email</th>
                    <th className="p-4 font-semibold text-sm">Department</th>
                    <th className="p-4 font-semibold text-sm text-right">Reg. Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border">
                  {participants.map((p, idx) => (
                    <tr key={idx} className="hover:bg-surface/30 transition-colors">
                      <td className="p-4 font-medium">{p.user?.name || 'Unknown'}</td>
                      <td className="p-4 text-text-muted text-sm">{p.user?.email || '-'}</td>
                      <td className="p-4 text-text-muted text-sm">{p.user?.department || '-'}</td>
                      <td className="p-4 text-text-muted text-xs text-right">
                        {new Date(p.registrationDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-surface/20 rounded-2xl border border-dashed border-glass-border">
              <Users size={48} className="mx-auto text-text-muted opacity-20 mb-4" />
              <p className="text-text-muted">No students have registered for this event yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventDetails;
