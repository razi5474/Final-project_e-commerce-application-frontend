import React, { useEffect, useState } from 'react';
import { api } from '../../config/axiosInstance';
import { toast } from 'react-hot-toast';

const AdminProfile = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/admin/profile');
      const { name, email, phone } = data.data;
      setFormData({ name, email, phone });
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch profile');
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

  return (
    <div className="p-6 max-w-xl mx-auto bg-base-100 text-base-content rounded-2xl shadow-md space-y-6">
  <h1 className="text-2xl font-semibold">Admin Profile</h1>

  <div className="space-y-4">
    {['name', 'email', 'phone'].map((field) => (
      <div key={field}>
        <label className="block text-sm font-medium capitalize">{field}</label>
        <input
          type={field === 'email' ? 'email' : 'text'}
          name={field}
          value={formData[field]}
          onChange={handleChange}
          readOnly={!isEditing}
          className={`w-full px-4 py-2 rounded-md border border-base-300 ${
            isEditing ? 'bg-base-100' : 'bg-base-200 cursor-not-allowed'
          }`}
        />
      </div>
    ))}
  </div>

  <div className="flex justify-end gap-4">
    {isEditing ? (
      <>
        <button
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 bg-gray-300 dark:bg-base-300 text-gray-800 dark:text-base-content rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Save
        </button>
      </>
    ) : (
      <button
        onClick={() => setIsEditing(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Edit Profile
      </button>
    )}
  </div>
</div>

  );
};

export default AdminProfile;
