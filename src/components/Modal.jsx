import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function Modal({ isOpen, onClose, onSubmit, editingItem }) {
  const [formData, setFormData] = useState({
    name: '',
    rating: 1,
    description: '',
    createdDate: new Date().toLocaleDateString('en-CA')
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingItem) {
      setFormData({
        id: editingItem._id,
        name: editingItem.name || '',
        rating: editingItem.rating || 1,
        description: editingItem.description || '',
        createdDate: editingItem.createdDate || new Date().toLocaleDateString('en-CA')
      });
    } else {
      setFormData({
        name: '',
        rating: 1,
        description: '',
        createdDate: new Date().toLocaleDateString('en-CA')
      });
    }
  }, [editingItem]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.rating < 1 || formData.rating > 5) newErrors.rating = 'Rating must be between 1 and 5';
    if (!formData.createdDate) newErrors.createdDate = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const url = editingItem
          ? `https://taskbackend-nine.vercel.app/api/items/${editingItem._id}`
          : "https://taskbackend-nine.vercel.app/api/items";
  
        const method = editingItem ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) throw new Error(`Failed to ${editingItem ? "update" : "create"} item`);
  
        const updatedItem = await response.json();
        onSubmit(updatedItem);
  
        setFormData({ name: "", rating: 1, description: "", createdDate: new Date().toLocaleDateString('en-CA') });
        setErrors({});
        onClose(); 
        window.location.reload(); 
      } catch (error) {
        console.error("Error saving item:", error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-w-[90%]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full border rounded p-2 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Rating (1-5)</label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              className={`w-full border rounded p-2 ${errors.rating ? 'border-red-500' : ''}`}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Created Date</label>
            <input
              type="date"
              value={formData.createdDate}
              onChange={(e) => setFormData({ ...formData, createdDate: e.target.value })}
              disabled={!!editingItem} 
              className={`w-full border rounded p-2 ${errors.createdDate ? 'border-red-500' : ''}`}
            />
            {errors.createdDate && <p className="text-red-500 text-sm mt-1">{errors.createdDate}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className={`w-full border rounded p-2 ${errors.description ? 'border-red-500' : ''}`}
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {editingItem ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
