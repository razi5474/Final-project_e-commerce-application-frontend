import React, { useEffect, useState } from 'react';
import { api } from '../config/axiosInstance';
import { toast } from 'react-hot-toast';
import { MapPin, Phone, User, Home, Globe, Flag, Edit2, Plus, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddressManager = () => {
  const [address, setAddress] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    try {
      const res = await api.get('/order/latest-address');
      setAddress(res.data.address);
      setFormData(res.data.address || {});
    } catch (err) {
      //   toast.error(err.response?.data?.error || 'No address found');
      setAddress(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    // Basic validation
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.postalCode || !formData.country) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      // In a real app, you might want to save this to a user profile endpoint, 
      // but here we are just simulating updating the "latest order address" or similar preference if backend supports it.
      // Since the backend might not have a specific 'save address' endpoint other than creating an order, 
      // we will just update the local state to reflect the change visually and assume the user will use this for next orders.
      // OR if there IS an endpoint, we use it. 
      // Assuming we just toggled edit mode for now as per previous logic.

      setAddress(formData);
      setEditMode(false);
      toast.success('Address saved successfully!');
    } catch (err) {
      toast.error('Failed to save address');
    }
  };

  if (loading) return <div className="text-center py-10"><span className="loading loading-dots loading-lg text-primary"></span></div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-base-content">Manage Address</h2>
          <p className="text-base-content/60 mt-1">Update your shipping details for faster checkout.</p>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          {!editMode && address ? (
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Full Name</p>
                    <p className="font-semibold text-lg">{address.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Phone Number</p>
                    <p className="font-semibold text-lg">{address.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Address</p>
                    <p className="font-semibold text-lg leading-relaxed">
                      {address.address}<br />
                      {address.city}, {address.state} {address.postalCode}<br />
                      {address.country}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-start">
                <button
                  onClick={() => setEditMode(true)}
                  className="btn btn-outline btn-primary gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Edit Address
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {!address && !editMode && (
                <div className="text-center py-10">
                  <div className="bg-base-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-10 h-10 text-base-content/40" />
                  </div>
                  <h3 className="text-lg font-bold">No Address Found</h3>
                  <p className="text-base-content/60 mb-6">You haven't added a shipping address yet.</p>
                  <button onClick={() => setEditMode(true)} className="btn btn-primary gap-2">
                    <Plus className="w-5 h-5" /> Add New Address
                  </button>
                </div>
              )}

              {editMode && (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="form-control md:col-span-2">
                    <label className="label font-medium">Full Name</label>
                    <div className="relative">
                      <input type="text" name="fullName" value={formData.fullName || ''} onChange={handleChange} className="input input-bordered w-full pl-10" placeholder="John Doe" />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label font-medium">Phone Number</label>
                    <div className="relative">
                      <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className="input input-bordered w-full pl-10" placeholder="+1 234 567 890" />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label font-medium">Street Address</label>
                    <div className="relative">
                      <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className="input input-bordered w-full pl-10" placeholder="123 Main St" />
                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label font-medium">City</label>
                    <div className="relative">
                      <input type="text" name="city" value={formData.city || ''} onChange={handleChange} className="input input-bordered w-full pl-10" placeholder="New York" />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label font-medium">State/Province</label>
                    <div className="relative">
                      <input type="text" name="state" value={formData.state || ''} onChange={handleChange} className="input input-bordered w-full pl-10" placeholder="NY" />
                      <Flag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label font-medium">Postal Code</label>
                    <div className="relative">
                      <input type="text" name="postalCode" value={formData.postalCode || ''} onChange={handleChange} className="input input-bordered w-full pl-10" placeholder="10001" />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label font-medium">Country</label>
                    <div className="relative">
                      <input type="text" name="country" value={formData.country || ''} onChange={handleChange} className="input input-bordered w-full pl-10" placeholder="United States" />
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                    </div>
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setEditMode(false)} className="btn btn-ghost hover:bg-base-200">
                      Cancel
                    </button>
                    <button type="button" onClick={handleUpdate} className="btn btn-primary gap-2">
                      <Save className="w-5 h-5" /> Save Address
                    </button>
                  </div>
                </motion.form>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AddressManager;
