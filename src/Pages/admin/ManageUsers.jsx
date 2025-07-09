import React, { useEffect, useState } from 'react';
import { api } from '../../config/axiosInstance';
import { FaToggleOn, FaToggleOff, FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/all-users');
      setUsers(res.data.users);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };

  const toggleBlock = async (userId) => {
    try {
      const res = await api.patch(`/admin/block-user/${userId}`);
      toast.success(res.data.message);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/user/delete/${userToDelete._id}`);
      toast.success(res.data.message || 'User deleted');
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4 text-base-content">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      {/* ✅ Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full border border-base-300">
          <thead className="bg-base-200">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-t border-base-300">
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td className="capitalize">{user.role}</td>
                <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
                <td className="flex justify-center gap-4 items-center py-2">
                  {user.role !== 'admin' ? (
                    <button onClick={() => toggleBlock(user._id)} className="text-xl">
                      {user.isBlocked
                        ? <FaToggleOff className="text-red-500" />
                        : <FaToggleOn className="text-green-500" />}
                    </button>
                  ) : (
                    <FaToggleOff className="text-base-content/30" title="Cannot block admin" />
                  )}
                  <button
                    onClick={() => confirmDelete(user)}
                    className="text-xl text-red-500 hover:text-red-700"
                    title="Delete User"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Cards */}
      <div className="md:hidden space-y-4">
        {users.map(user => (
          <div key={user._id} className="bg-base-100 p-4 rounded-lg shadow border border-base-300">
            <p><span className="font-semibold">Name:</span> {user.name}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Phone:</span> {user.phone}</p>
            <p><span className="font-semibold">Role:</span> <span className="capitalize">{user.role}</span></p>
            <p><span className="font-semibold">Status:</span> {user.isBlocked ? 'Blocked' : 'Active'}</p>
            <div className="flex justify-end gap-4 mt-2">
              {user.role !== 'admin' ? (
                <button onClick={() => toggleBlock(user._id)}>
                  {user.isBlocked
                    ? <FaToggleOff className="text-red-500 text-xl" />
                    : <FaToggleOn className="text-green-500 text-xl" />}
                </button>
              ) : (
                <FaToggleOff className="text-base-content/30 text-xl" title="Cannot block admin" />
              )}
              <button onClick={() => confirmDelete(user)} className="text-red-500 text-xl">
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔴 Delete Modal */}
      {showModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg shadow-lg p-6 max-w-md w-full text-base-content">
            <h3 className="text-lg font-semibold mb-2 text-red-600">Delete User</h3>
            <p className="mb-4">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{userToDelete.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1 rounded bg-base-200 hover:bg-base-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
