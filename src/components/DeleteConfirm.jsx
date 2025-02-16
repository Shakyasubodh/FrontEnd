import React, { useState } from "react";
import { X } from "lucide-react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function DeleteConfirm({ isOpen, onClose, onDeleteSuccess, item }) {
  const [loading, setLoading] = useState(false);

  
  if (!isOpen || !item || !item._id) return null;

  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}api/items/${item._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("Failed to delete item");

      console.log("Item deleted successfully:", item._id);

     
      onDeleteSuccess(item._id);

     
      onClose();
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg w-96 max-w-[90%]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Confirm Delete</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete ?</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirm;
