import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { api } from '../config/axiosInstance';
import { toast } from 'react-hot-toast';
import { saveUser } from '../Redux/Features/user/userSlice';


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
    <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md bg-base-100 text-base-content">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Personal Information</h2>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="text-primary hover:underline font-medium"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="text-success hover:underline font-medium"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="text-gray-500 hover:underline font-medium"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!editMode}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!editMode}
            className="input input-bordered w-full"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!editMode}
            className="input input-bordered w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
