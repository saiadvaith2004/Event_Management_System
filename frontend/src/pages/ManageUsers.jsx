import React, { useEffect, useState } from 'react';
import { userApi } from '../api';
import { UserCheck, UserX, Shield, Mail, Building } from 'lucide-react';

const ManageUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const res = await userApi.listPending();
      setPendingUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this user account?')) return;
    try {
      await userApi.approve(id);
      setPendingUsers(pendingUsers.filter(u => u.id !== id));
    } catch (err) {
      alert('Approval failed');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject and delete this registration request?')) return;
    try {
      await userApi.reject(id);
      setPendingUsers(pendingUsers.filter(u => u.id !== id));
    } catch (err) {
      alert('Rejection failed');
    }
  };

  if (loading) return <div className="text-center py-20 animate-pulse">Loading user requests...</div>;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold mb-2">User Moderation</h1>
        <p className="text-text-muted text-lg">Approve or reject staff account requests (Club Heads & Admins).</p>
      </header>

      {pendingUsers.length === 0 ? (
        <div className="glass-card text-center py-20">
          <Shield className="mx-auto text-primary/20 mb-4" size={64} />
          <h2 className="text-2xl font-bold mb-2">All Caught Up!</h2>
          <p className="text-text-muted text-lg">There are no pending user registration requests at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingUsers.map((user) => (
            <div key={user.id} className="glass-card flex flex-col md:flex-row items-center justify-between p-8 group hover:border-primary/40 transition-all">
              <div className="flex items-center gap-8 mb-6 md:mb-0">
                <div className="h-20 w-20 rounded-[1.5rem] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Shield size={36} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold">{user.name}</h3>
                    <span className="badge bg-accent/10 text-accent border-accent/20 px-3 py-1 font-bold text-xs">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 text-sm text-text-muted font-medium pt-1">
                    <span className="flex items-center gap-2"><Mail size={16} className="text-primary"/> {user.email}</span>
                    <span className="flex items-center gap-2"><Building size={16} className="text-primary"/> {user.department}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                  onClick={() => handleApprove(user.id)}
                  className="flex-1 md:flex-none btn-primary bg-success hover:bg-success/80 border-none flex items-center justify-center gap-2 py-3 px-6"
                >
                  <UserCheck size={20} /> Approve
                </button>
                <button 
                  onClick={() => handleReject(user.id)}
                  className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-error/10 hover:bg-error/20 text-error border border-error/20 font-bold transition-all flex items-center justify-center gap-2"
                >
                  <UserX size={20} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
