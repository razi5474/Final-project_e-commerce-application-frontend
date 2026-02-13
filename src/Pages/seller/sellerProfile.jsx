import React, { useEffect, useState } from 'react';
import { api } from '../../config/axiosInstance';
import Loader from '../../components/common/Loader';
import { User, Mail, Phone, Store, MapPin, FileText, Edit2, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const SellerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/seller/profile');
      setProfile(data);
      setFormData({
        name: data.user.name || '',
        email: data.user.email || '',
        phone: data.user.phone || '',
        storeName: data.seller.storeName || '',
        storeDescription: data.seller.storeDescription || '',
        storeAddress: data.seller.storeAddress || '',
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch('/seller/update', formData);
      setProfile(data);
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading profile..." />;

  const fields = [
    { name: 'name', label: 'Full Name', icon: <User className="w-5 h-5" /> },
    { name: 'email', label: 'Email', icon: <Mail className="w-5 h-5" />, disabled: true },
    { name: 'phone', label: 'Phone', icon: <Phone className="w-5 h-5" /> },
    { name: 'storeName', label: 'Store Name', icon: <Store className="w-5 h-5" /> },
    { name: 'storeAddress', label: 'Store Address', icon: <MapPin className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-base-content">Seller Profile</h2>
          <p className="text-base-content/60 mt-1">Manage your personal and store information.</p>
        </div>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="btn btn-primary gap-2"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        )}
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          {editMode ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field) => (
                  <div key={field.name} className="form-control">
                    <label className="label font-medium">{field.label}</label>
                    <div className="relative">
                      <input
                        type={field.name === 'email' ? 'email' : 'text'}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        disabled={field.disabled}
                        className={`input input-bordered w-full pl-10 ${field.disabled ? 'bg-base-200' : ''}`}
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40">
                        {field.icon}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="form-control md:col-span-2">
                  <label className="label font-medium">Store Description</label>
                  <div className="relative">
                    <textarea
                      className="textarea textarea-bordered w-full pl-10 min-h-[100px]"
                      name="storeDescription"
                      value={formData.storeDescription}
                      onChange={handleChange}
                    ></textarea>
                    <div className="absolute left-3 top-6 text-base-content/40">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
                <button
                  className="btn btn-ghost"
                  onClick={() => setEditMode(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary gap-2"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? <span className="loading loading-spinner loading-sm"></span> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {fields.map((field) => (
                <div key={field.name} className="flex items-center gap-4 p-4 rounded-xl bg-base-200/50">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {field.icon}
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-base-content/50 tracking-wider mb-0.5">{field.label}</p>
                    <p className="font-semibold text-lg">{profile.user[field.name] || profile.seller[field.name]}</p>
                  </div>
                </div>
              ))}
              <div className="md:col-span-2 flex items-start gap-4 p-4 rounded-xl bg-base-200/50">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase font-bold text-base-content/50 tracking-wider mb-2">Store Description</p>
                  <p className="leading-relaxed text-base-content/80">{profile.seller.storeDescription}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
