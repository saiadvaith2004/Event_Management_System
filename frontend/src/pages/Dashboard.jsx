import React, { useEffect, useState } from 'react';
import { eventApi, dashboardApi } from '../api';
import { Calendar, Users, MapPin, ArrowRight, Plus, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, totalRegistrations: 0, totalResources: 0 });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [eventsRes, statsRes] = await Promise.all([
          eventApi.list(),
          dashboardApi.stats()
        ]);
        setEvents(eventsRes.data);
        setStats(statsRes.data);

        if (user && (user.role === 'CLUB_HEAD' || user.role === 'ADMIN')) {
          const myEventsRes = await eventApi.listMyEvents(user.id);
          setMyEvents(myEventsRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statsConfig = [
    { label: 'Upcoming Events', value: stats.totalEvents, icon: <Calendar />, color: 'rgba(99, 102, 241, 0.1)', textColor: 'text-primary' },
    { label: 'Registered', value: stats.totalRegistrations, icon: <Users />, color: 'rgba(236, 72, 153, 0.1)', textColor: 'text-secondary' },
    { label: 'Resources', value: stats.totalResources, icon: <MapPin />, color: 'rgba(139, 92, 246, 0.1)', textColor: 'text-accent' },
  ];

  return (
    <div className="animate-fade-in">
      <header className="mb-12 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">Welcome back, {user?.name || 'Student'}!</h1>
          <p className="text-text-muted text-lg">Check out what's happening on campus today.</p>
        </div>
        <Link to="/events/create" className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Create Event
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {statsConfig.map((stat, i) => (
          <div key={i} className="glass-card flex items-center gap-6">
            <div 
              className="w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center" 
              style={{ backgroundColor: stat.color }}
            >
              {React.cloneElement(stat.icon, { size: 32, className: stat.textColor })}
            </div>
            <div>
              <p className="text-text-muted text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {myEvents.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold">My Event Requests</h2>
            <span className="badge bg-primary text-primary/100 border-none px-3 py-1 font-bold">{myEvents.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myEvents.map((req) => (
              <div key={req.id} className="glass-card flex items-center justify-between p-6 hover:border-primary/30 transition-all group">
                <div className="flex items-center gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-surface flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Calendar size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{req.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-text-muted font-medium">
                      <span className="flex items-center gap-1"><Clock size={12}/> {new Date(req.startDatetime).toLocaleDateString()}</span>
                      <span className={`px-2 py-0.5 rounded-full border ${
                        req.status === 'APPROVED' ? 'bg-success/10 text-success border-success/20' : 
                        req.status === 'REJECTED' ? 'bg-error/10 text-error border-error/20' : 
                        'bg-primary/10 text-primary border-primary/20'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  </div>
                </div>
                <Link to={`/events/${req.id}`} className="p-3 rounded-xl bg-surface hover:bg-primary/10 text-text-muted hover:text-primary transition-all">
                  <ArrowRight size={20} />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <button 
              onClick={() => {
                setLoading(true);
                dashboardApi.stats().then(res => setStats(res.data)).finally(() => setLoading(false));
              }}
              className="p-2 rounded-xl bg-surface hover:bg-surface-hover text-primary transition-all hover:rotate-180 duration-500"
              title="Refresh Data"
            >
              <Plus className="rotate-45" size={20} />
            </button>
          </div>
          <Link to="/events" className="btn-primary py-2 px-6 text-sm flex items-center gap-2 group">
            View All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.length > 0 ? events.map((event, idx) => (
              <div 
                key={event.id} 
                className="group relative p-[1px] rounded-[2rem] bg-gradient-to-br from-glass-border to-transparent hover:from-primary/50 hover:to-secondary/50 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="glass-card h-full flex flex-col bg-[#1e293b]/90 backdrop-blur-2xl rounded-[1.9rem]">
                  <div className="aspect-video bg-surface rounded-2xl mb-5 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                      {event.imageUrl ? (
                        <img src={`http://localhost:8080${event.imageUrl}`} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <Calendar size={48} className="text-primary/40 group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    <div className="absolute top-4 left-4 z-20">
                      <span className="badge bg-primary/20 text-primary backdrop-blur-md">
                        {event.club?.name || 'Campus Event'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{event.title}</h3>
                    <p className="text-text-muted text-sm mb-6 line-clamp-2 leading-relaxed">{event.description}</p>
                  </div>

                  <div className="pt-4 border-t border-glass-border flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Organizer</span>
                      <span className="text-xs font-semibold text-text">{event.organizer?.name}</span>
                    </div>
                    <Link to={`/events/${event.id}`} className="btn-primary py-2.5 px-5 text-xs shadow-none">
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full glass-card text-center py-12">
                <p className="text-text-muted">No events found. Start by creating one!</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
