import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventApi, registrationApi } from '../api';
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    eventApi.details(id)
      .then(res => setEvent(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

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
            <button 
              onClick={handleRegister}
              disabled={registering || success}
              className={`btn-primary px-10 py-4 text-lg flex items-center gap-2 ${success ? 'bg-success shadow-none transform-none' : ''}`}
            >
              {registering ? 'Processing...' : success ? <><CheckCircle /> Registered!</> : 'Register Now'}
            </button>
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
    </div>
  );
};

export default EventDetails;
