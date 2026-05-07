import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Calendar, AlertCircle } from 'lucide-react';
import { authApi } from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('advaith@campus.edu');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login(email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(typeof err.response?.data === 'string' ? err.response.data : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="glass-card w-full max-w-md p-10">
        <div className="text-center mb-10">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-primary h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-text-muted mt-2">Sign in to manage your campus events</p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-2xl mb-6 flex items-center gap-3 animate-fade-in">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="email"
                required
                className="input-field pl-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="password"
                required
                className="input-field pl-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="rounded border-glass-border bg-surface text-primary focus:ring-primary/20" />
              <span className="text-text-muted group-hover:text-text transition-colors">Remember me</span>
            </label>
            <a href="#" className="text-primary hover:text-primary-hover font-semibold transition-colors">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg"
          >
            {loading ? 'Authenticating...' : <><LogIn size={22} /> Sign In</>}
          </button>
        </form>

        <p className="text-center text-text-muted mt-10 text-sm">
          Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
