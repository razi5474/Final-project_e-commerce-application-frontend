import React, { useEffect, useState } from 'react';
import { api } from '../../config/axiosInstance';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, Save, X, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminProfile = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/admin/profile');
      const { name, email, phone } = data.data;
      setFormData({ name, email, phone });
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const { data } = await api.patch('/admin/update-profile', formData);
      setFormData({
        name: data.data.name,
        email: data.data.email,
        phone: data.data.phone,
      });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const getIcon = (field) => {
    switch (field) {
      case 'name': return <User className="w-5 h-5" />;
      case 'email': return <Mail className="w-5 h-5" />;
      case 'phone': return <Phone className="w-5 h-5" />;
      default: return null;
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-base-content">My Profile</h2>
          <p className="text-base-content/60 mt-1">Manage your admin account details.</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn btn-primary gap-2">
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        )}
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 w-full md:w-auto">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-32 text-4xl font-bold">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'A'}
                </div>
              </div>
              <div className="badge badge-primary badge-outline">Administrator</div>
            </div>

            {/* Form Section */}
            <div className="flex-1 w-full space-y-6">
              <div className="grid gap-6">
                {['name', 'email', 'phone'].map((field) => (
                  <div key={field} className="form-control">
                    <label className="label">
                      <span className="label-text capitalize font-medium">{field}</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                        {getIcon(field)}
                      </div>
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={`input input-bordered w-full pl-10 ${!isEditing ? 'bg-base-200/50' : 'bg-base-100'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <AnimatePresence>
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-end gap-3 pt-4"
                  >
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn btn-ghost gap-2"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="btn btn-primary gap-2"
                    >
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
