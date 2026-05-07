import React, { useEffect, useState } from 'react';
import { resourceApi } from '../api';
import { MapPin, Users, CheckCircle, XCircle, Building2 } from 'lucide-react';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await resourceApi.list();
        setResources(res.data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  return (
    <div className="animate-fade-in">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold mb-3">Campus Resources</h1>
        <p className="text-text-muted text-lg">Browse available venues and labs for your next event.</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.length > 0 ? (
            resources.map((resource, idx) => (
              <div 
                key={resource.id} 
                className="glass-card flex flex-col p-6 hover:border-primary/30 transition-all duration-300 group"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Building2 size={32} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
                    resource.isAvailable 
                      ? 'bg-success/10 text-success border-success/20' 
                      : 'bg-error/10 text-error border-error/20'
                  }`}>
                    {resource.isAvailable ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {resource.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{resource.name}</h3>
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted mb-6 inline-block">
                  {resource.type}
                </span>

                <div className="mt-auto space-y-4">
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <MapPin size={18} className="text-primary/70" />
                    <span>{resource.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <Users size={18} className="text-secondary/70" />
                    <span>Capacity: <strong className="text-text">{resource.capacity} people</strong></span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <Building2 size={64} className="mx-auto text-text-muted/30 mb-4" />
              <p className="text-xl text-text-muted font-medium">No resources found on campus.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Resources;
