import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, AlignLeft, Users, MapPin, Save, X, Image as ImageIcon } from 'lucide-react';
import { eventApi, resourceApi } from '../api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDatetime: '',
    endDatetime: '',
    resourceId: '',
    maxParticipants: 100,
  });

  useEffect(() => {
    resourceApi.list().then(res => setResources(res.data)).catch(err => console.error(err));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        const uploadRes = await eventApi.upload(imageFile);
        imageUrl = uploadRes.data;
      }

      const eventData = {
        ...formData,
        imageUrl,
        organizerId: storedUser.id,
        clubId: storedUser.role === 'CLUB_HEAD' ? 3 : null, // Default to Tech Pioneers for demo
        status: 'PENDING',
        category: 'Technical' // Added missing required field
      };
      await eventApi.create(eventData);
      navigate('/events');
    } catch (err) {
      console.error(err);
      alert('Failed to create event. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">Create New Event</h1>
          <p className="text-text-muted">Fill in the details to host a new campus event.</p>
        </div>
        <button onClick={() => navigate(-1)} className="p-3 rounded-2xl bg-surface hover:bg-surface-hover text-text-muted transition-all">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="glass-card space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-muted flex items-center gap-2">
            <Calendar size={16} className="text-primary" /> Event Title
          </label>
          <input
            required
            type="text"
            className="input-field"
            placeholder="e.g. Annual Tech Symposium"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-muted flex items-center gap-2">
            <AlignLeft size={16} className="text-primary" /> Description
          </label>
          <textarea
            required
            rows="4"
            className="input-field resize-none"
            placeholder="Tell us what this event is about..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted">Start Date & Time</label>
            <input
              required
              type="datetime-local"
              className="input-field"
              value={formData.startDatetime}
              onChange={(e) => setFormData({ ...formData, startDatetime: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted">End Date & Time</label>
            <input
              required
              type="datetime-local"
              className="input-field"
              value={formData.endDatetime}
              onChange={(e) => setFormData({ ...formData, endDatetime: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted flex items-center gap-2">
              <MapPin size={16} className="text-primary" /> Venue / Resource
            </label>
            <select
              required
              className="input-field appearance-none"
              value={formData.resourceId}
              onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
            >
              <option value="">Select a venue</option>
              {resources.map(res => (
                <option key={res.id} value={res.id}>{res.name} ({res.location})</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted flex items-center gap-2">
              <Users size={16} className="text-primary" /> Max Participants
            </label>
            <input
              type="number"
              className="input-field"
              value={formData.maxParticipants}
              onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted flex items-center gap-2">
              <ImageIcon size={16} className="text-primary" /> Event Poster / Image
            </label>
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-40 bg-surface rounded-2xl border-2 border-dashed border-glass-border flex items-center justify-center overflow-hidden group">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={32} className="text-text-muted opacity-20" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="text-xs text-text-muted">
                <p className="font-bold text-text mb-1">Click to upload</p>
                <p>PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <button
            disabled={loading}
            type="submit"
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {loading ? 'Creating...' : <><Save size={20} /> Create Event</>}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-8 py-3 rounded-2xl bg-surface hover:bg-surface-hover font-bold transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
