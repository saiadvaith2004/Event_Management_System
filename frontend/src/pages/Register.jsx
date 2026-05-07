import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, BookOpen, GraduationCap, AlertCircle, Shield } from 'lucide-react';
import { authApi } from '../api';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    yearOfStudy: 1,
    role: 'STUDENT'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.register(formData);
      if (typeof res.data === 'string') {
        alert(res.data);
      }
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center animate-fade-in py-12">
      <div className="glass-card w-full max-w-lg p-10">
        <div className="text-center mb-10">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-primary h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-text-muted mt-2">Join your campus events community today</p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-2xl mb-6 flex items-center gap-3 animate-fade-in">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-muted ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  name="name"
                  type="text" 
                  required 
                  className="input-field pl-12" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-muted ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  name="email"
                  type="email" 
                  required 
                  className="input-field pl-12" 
                  placeholder="john@campus.edu"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                name="password"
                type="password" 
                required 
                className="input-field pl-12" 
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted ml-1">Account Type</label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <select 
                name="role"
                className="input-field pl-12 appearance-none"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="STUDENT">Student</option>
                <option value="CLUB_HEAD">Club Head (Organizer)</option>
              </select>
            </div>
            {formData.role === 'CLUB_HEAD' && (
              <p className="text-[10px] text-accent font-bold animate-pulse">NOTE: Club Head accounts require manual admin approval.</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-muted ml-1">Department</label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  name="department"
                  type="text" 
                  required 
                  className="input-field pl-12" 
                  placeholder="Computer Science"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-muted ml-1">Year of Study</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <select 
                  name="yearOfStudy"
                  className="input-field pl-12 appearance-none"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg"
          >
            {loading ? 'Creating Account...' : <><UserPlus size={22} /> Sign Up</>}
          </button>
        </form>

        <p className="text-center text-text-muted mt-10 text-sm">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
