import React, { useEffect, useState } from 'react';
import { api } from '../config/axiosInstance';
import { toast } from 'react-hot-toast';

const AddressManager = () => {
  const [address, setAddress] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await api.get('/order/latest-address');
        setAddress(res.data.address);
        setFormData(res.data.address); // for edit mode
      } catch (err) {
        toast.error(err.response?.data?.error || 'No address found');
      }
    };

    fetchAddress();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      // Optional: send update to backend if saving
      setAddress(formData);
      setEditMode(false);
      toast.success('Address updated locally.');
    } catch (err) {
      toast.error('Failed to update address');
    }
  };

  if (!address) {
    return (
      <div className="text-center py-6">
        <h2 className="text-xl font-semibold">Manage Addresses</h2>
        <p className="text-gray-500 mt-2">No address found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-base-content">Manage Address</h2>

      {!editMode ? (
        <div className="space-y-1 text-base-content">
          <p><strong>Name:</strong> {address.fullName}</p>
          <p><strong>Phone:</strong> {address.phone}</p>
          <p><strong>Address:</strong> {address.address}, {address.city}, {address.state}, {address.postalCode}</p>
          <p><strong>Country:</strong> {address.country}</p>
          <button
            onClick={() => setEditMode(true)}
            className="btn btn-outline btn-primary mt-4"
          >
            Edit Address
          </button>
        </div>
      ) : (
        <form className="space-y-3">
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="input input-bordered w-full" placeholder="Full Name" />
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input input-bordered w-full" placeholder="Phone Number" />
          <input type="text" name="address" value={formData.address} onChange={handleChange} className="input input-bordered w-full" placeholder="Street Address" />
          <input type="text" name="city" value={formData.city} onChange={handleChange} className="input input-bordered w-full" placeholder="City" />
          <input type="text" name="state" value={formData.state} onChange={handleChange} className="input input-bordered w-full" placeholder="State" />
          <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="input input-bordered w-full" placeholder="Postal Code" />
          <button type="button" onClick={handleUpdate} className="btn btn-primary w-full">Save Address</button>
        </form>
      )}
    </div>
  );
};

export default AddressManager;
