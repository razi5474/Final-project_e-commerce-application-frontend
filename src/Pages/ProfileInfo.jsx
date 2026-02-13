import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { api } from '../config/axiosInstance';
import { toast } from 'react-hot-toast';
import { saveUser } from '../Redux/Features/user/userSlice';
import { User, Phone, Mail, Edit2, Save, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileInfo = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get('/user/profile');
        dispatch(saveUser(res.data.data));
        setFormData({
          name: res.data.data.name || '',
          phone: res.data.data.phone || '',
          email: res.data.data.email || '',
        });
      } catch (err) {
        console.log(err);
        toast.error(err.response?.data?.error || 'Failed to fetch user data');
      }
    };

    fetchUserProfile();
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await api.patch('/user/update', formData);
      toast.success(res.data.message);
      dispatch(saveUser(res.data.data));
      setEditMode(false);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-200">
        {/* Header/Cover Area */}
        <div className="h-32 bg-gradient-to-r from-primary/10 to-secondary/10 relative">
          <div className="absolute -bottom-10 left-6">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-2 bg-base-300">
                <img src="/images/man_2922510.png" alt="Profile" />
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="btn btn-sm btn-ghost gap-2 text-primary"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="btn btn-sm btn-ghost gap-2"
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn btn-sm btn-primary gap-2"
                  disabled={loading}
                >
                  {loading ? <span className="loading loading-spinner loading-xs"></span> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="pt-12 px-6 pb-8">
          <div className="flex flex-col gap-1 mb-8">
            <h2 className="text-2xl font-bold">{formData.name || 'User Name'}</h2>
            <p className="text-base-content/60">Manage your personal information</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editMode}
                className={`input input-bordered w-full ${!editMode ? 'bg-base-200/50 border-transparent' : ''}`}
              />
            </div>

            {/* Phone Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Phone Number
                </span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editMode}
                className={`input input-bordered w-full ${!editMode ? 'bg-base-200/50 border-transparent' : ''}`}
              />
            </div>

            {/* Email Field */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Address
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editMode}
                className={`input input-bordered w-full ${!editMode ? 'bg-base-200/50 border-transparent' : ''}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
