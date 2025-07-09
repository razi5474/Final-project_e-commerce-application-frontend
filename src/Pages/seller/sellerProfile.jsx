import React, { useEffect, useState } from 'react';
import { api } from '../../config/axiosInstance';
import Loader from '../../components/common/Loader';

const SellerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch('/seller/update', formData);
      setProfile(data);
      setEditMode(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading profile..." />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Seller Profile</h2>
      <div className="bg-base-100 text-base-content shadow-md rounded p-4 space-y-4">
        {editMode ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="border border-base-300 bg-base-200 text-base-content p-2 rounded w-full"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
              />
              <input
                className="border border-base-300 bg-base-200 text-base-content p-2 rounded w-full"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <input
                className="border border-base-300 bg-base-200 text-base-content p-2 rounded w-full"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
              />
              <input
                className="border border-base-300 bg-base-200 text-base-content p-2 rounded w-full"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                placeholder="Store Name"
              />
              <input
                className="border border-base-300 bg-base-200 text-base-content p-2 rounded w-full"
                name="storeDescription"
                value={formData.storeDescription}
                onChange={handleChange}
                placeholder="Store Description"
              />
              <input
                className="border p-2 rounded w-border border-base-300 bg-base-200 text-base-content p-2 rounded w-full"
                name="storeAddress"
                value={formData.storeAddress}
                onChange={handleChange}
                placeholder="Store Address"
              />
            </div>
            <div className="flex gap-4 mt-4">
              <button
                className="bg-success text-white px-4 py-2 rounded hover:bg-success-focus"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                className="bg-base-300 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>Name:</strong> {profile.user.name}</p>
              <p><strong>Email:</strong> {profile.user.email}</p>
              <p><strong>Phone:</strong> {profile.user.phone}</p>
              <p><strong>Store Name:</strong> {profile.seller.storeName}</p>
              <p><strong>Store Description:</strong> {profile.seller.storeDescription}</p>
              <p><strong>Store Address:</strong> {profile.seller.storeAddress}</p>
            </div>
            <button
              className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;
