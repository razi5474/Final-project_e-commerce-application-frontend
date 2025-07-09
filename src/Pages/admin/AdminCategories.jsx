import React, { useEffect, useState } from "react";
import { api } from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import ConfirmModal from "../../components/common/ConfirmModal";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/category");
      setCategories(data.catagories);
    } catch (err) {
      toast.error("Failed to load categories");
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
      } else {
        await api.post("/category/create", form);
        toast.success("Category created");
      }
      setForm({ name: "", description: "" });
      setEditingId(null);
      fetchCategories();
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
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Category name"
          className="input input-bordered w-full md:w-1/3"
          required
        />
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="input input-bordered w-full md:w-1/3"
        />
        <button type="submit" className="btn btn-primary">
          {editingId ? "Update" : "Create"}
        </button>
      </form>

      {/* Table View (Desktop) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full border border-base-200">
          <thead>
            <tr className="bg-base-200">
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td>{cat.name}</td>
                <td>{cat.description || "-"}</td>
                <td className="flex gap-2">
                  <button className="btn btn-xs btn-warning" onClick={() => handleEdit(cat)}>
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-xs btn-error text-white"
                    onClick={() => {
                      setSelectedId(cat._id);
                      setShowModal(true);
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card View (Mobile) */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-base-100 border border-base-300 rounded-lg p-4 shadow">
            <h3 className="font-semibold text-lg">{cat.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{cat.description || "No description"}</p>
            <div className="flex justify-end gap-2">
              <button className="btn btn-sm btn-warning" onClick={() => handleEdit(cat)}>
                <FaEdit />
              </button>
              <button
                className="btn btn-sm btn-error text-white"
                onClick={() => {
                  setSelectedId(cat._id);
                  setShowModal(true);
                }}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {showModal && (
        <ConfirmModal
          message="Are you sure you want to delete this category?"
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default AdminCategories;
