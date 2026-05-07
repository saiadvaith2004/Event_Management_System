import React, { useEffect, useState } from 'react';
import { eventApi } from '../api';
import { Calendar, Filter, Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    eventApi.list()
      .then(res => setEvents(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Campus Events</h1>
          <p className="text-text-muted">Discover and join events happening around you.</p>
        </div>
        <Link to="/events/create" className="btn-primary flex items-center gap-2 self-start md:self-auto">
          <Plus size={20} /> Create Event
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="input-field pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="glass-card py-2 px-6 flex items-center gap-2 text-text-muted hover:text-text transition-all border-none">
          <Filter size={20} /> Filters
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, idx) => (
            <div 
              key={event.id} 
              className="group relative p-[1px] rounded-[2rem] bg-gradient-to-br from-glass-border to-transparent hover:from-primary/50 hover:to-secondary/50 transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="glass-card h-full flex flex-col bg-[#1e293b]/90 backdrop-blur-2xl rounded-[1.9rem]">
                <div className="aspect-video bg-surface rounded-2xl mb-5 overflow-hidden relative">
                  <div className="absolute top-4 right-4 z-20">
                    <span className={`badge ${event.status === 'APPROVED' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'} backdrop-blur-md`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                    <Calendar size={48} className="text-primary/40 group-hover:text-primary transition-colors" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                  <div className="flex items-center gap-2 text-text-muted text-xs mb-4">
                    <Calendar size={14} className="text-primary" />
                    {new Date(event.startDatetime).toLocaleDateString()} at {new Date(event.startDatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <p className="text-text-muted text-sm mb-6 line-clamp-3 leading-relaxed">{event.description}</p>
                </div>

                <div className="pt-4 border-t border-glass-border flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Organizer</span>
                    <span className="text-xs font-semibold text-text">{event.organizer?.name || 'Club Head'}</span>
                  </div>
                  <Link to={`/events/${event.id}`} className="btn-primary py-2.5 px-5 text-xs shadow-none">
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {filteredEvents.length === 0 && (
            <div className="col-span-full text-center py-20 glass-card">
              <p className="text-text-muted text-lg">No events matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventList;
