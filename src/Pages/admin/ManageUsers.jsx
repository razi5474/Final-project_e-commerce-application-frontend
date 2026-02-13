import React, { useEffect, useState } from 'react';
import { api } from '../../config/axiosInstance';
import { Trash2, Ban, CheckCircle, Search, UserX, UserCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/all-users');
      setUsers(res.data.users);
      setFilteredUsers(res.data.users);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const toggleBlock = async (userId) => {
    try {
      const res = await api.patch(`/admin/block-user/${userId}`);
      toast.success(res.data.message);
      // Optimistic update
      setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
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
      setUsers(users.filter(u => u._id !== userToDelete._id));
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-base-content">Manage Users</h2>
          <p className="text-base-content/60 mt-1">View and manage registered users.</p>
        </div>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search users..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body p-0">
          {/* Desktop Table */}
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-200/50">
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
                <AnimatePresence>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      className="hover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td>
                        <div className="font-bold">{user.name}</div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone || 'N/A'}</td>
                      <td>
                        <div className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-ghost'} badge-sm`}>{user.role}</div>
                      </td>
                      <td>
                        {user.isBlocked ? (
                          <div className="badge badge-error gap-1 text-white">
                            <Ban className="w-3 h-3" /> Blocked
                          </div>
                        ) : (
                          <div className="badge badge-success gap-1 text-white">
                            <CheckCircle className="w-3 h-3" /> Active
                          </div>
                        )}
                      </td>
                      <td className="flex justify-center gap-2">
                        {user.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => toggleBlock(user._id)}
                              className={`btn btn-square btn-sm ${user.isBlocked ? 'btn-success text-white' : 'btn-warning text-white'}`}
                              title={user.isBlocked ? "Unblock User" : "Block User"}
                            >
                              {user.isBlocked ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => confirmDelete(user)}
                              className="btn btn-square btn-sm btn-error text-white"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {loading && <div className="text-center py-10"><span className="loading loading-spinner text-primary"></span></div>}
            {!loading && filteredUsers.length === 0 && <div className="text-center py-10 text-base-content/60">No users found.</div>}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showModal && userToDelete && (
        <dialog id="delete_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Delete User</h3>
            <p className="py-4">
              Are you sure you want to delete <span className="font-bold">{userToDelete.name}</span>?
              This action cannot be undone.
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-error text-white" onClick={handleDelete}>Delete</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowModal(false)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default ManageUsers;
