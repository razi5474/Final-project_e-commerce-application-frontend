import React, { useEffect, useState } from "react";
import { api } from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { Edit2, Trash2, Plus, Info, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/category");
      setCategories(data.catagories);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/category/update/${editingId}`, form);
        toast.success("Category updated");
        setCategories(categories.map(c => c._id === editingId ? { ...c, ...form } : c));
      } else {
        const { data } = await api.post("/category/create", form);
        toast.success("Category created");
        fetchCategories(); // Refresh to get the new ID
      }
      setForm({ name: "", description: "" });
      setEditingId(null);
    } catch (err) {
      toast.error("Error saving category");
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description });
    setEditingId(cat._id);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/category/delete/${selectedId}`);
      toast.success("Category deleted");
      setCategories(categories.filter(c => c._id !== selectedId));
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleCancelEdit = () => {
    setForm({ name: "", description: "" });
    setEditingId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-base-content">Manage Categories</h2>
          <p className="text-base-content/60 mt-1">Create and modify product categories.</p>
        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="md:col-span-1">
          <div className="card bg-base-100 shadow-xl border border-base-200 top-4 sticky">
            <div className="card-body">
              <h3 className="card-title text-base-content/80">
                {editingId ? <><Edit2 className="w-5 h-5" /> Edit Category</> : <><Plus className="w-5 h-5" /> New Category</>}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Category Name</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Electronics"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief description..."
                    className="textarea textarea-bordered h-24"
                  />
                </div>
                <div className="card-actions justify-end mt-4">
                  {editingId && (
                    <button type="button" className="btn btn-ghost" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary">
                    {editingId ? "Update Category" : "Create Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="md:col-span-2 space-y-4">
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead className="bg-base-200/50">
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {categories.map((cat, index) => (
                        <motion.tr
                          key={cat._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover"
                        >
                          <td className="font-bold">{cat.name}</td>
                          <td className="max-w-xs truncate text-base-content/70">{cat.description || <span className="italic opacity-50">No description</span>}</td>
                          <td className="text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                className="btn btn-square btn-sm btn-ghost hover:text-primary transition"
                                onClick={() => handleEdit(cat)}
                                title="Edit Category"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                className="btn btn-square btn-sm btn-ghost hover:text-error transition"
                                onClick={() => {
                                  setSelectedId(cat._id);
                                  setShowModal(true);
                                }}
                                title="Delete Category"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                {loading && <div className="text-center py-10"><span className="loading loading-spinner text-primary"></span></div>}
                {!loading && categories.length === 0 && <div className="text-center py-10 text-base-content/60">No categories found.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showModal && (
        <dialog id="delete_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Delete Category</h3>
            <p className="py-4">Are you sure you want to delete this category? This might affect products linked to it.</p>
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

export default AdminCategories;
