import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Table from './components/Table';
import Modal from './components/Modal';
import DeleteConfirm from './components/DeleteConfirm';

function App() {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Load items from localStorage
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    const savedItems = localStorage.getItem('items');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  };

  // Save items to localStorage
  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  const handleAdd = (newItem) => {
    setItems([...items, { ...newItem, id: Date.now(), date: new Date().toLocaleDateString() }]);
    setIsModalOpen(false);
  };

  const handleEdit = (updatedItem) => {
    setItems(items.map(item => 
      item.id === updatedItem.id ? { ...updatedItem, date: item.date } : item
    ));
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
    fetchItems(); 
    window.location.reload();
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const startDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">CRUD Application</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} /> Add New
          </button>
        </div>

        <Table 
          items={items} 
          onEdit={startEdit}
          onDelete={startDelete}
        />

        <Modal 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSubmit={editingItem ? handleEdit : handleAdd}
          editingItem={editingItem}
        />

        <DeleteConfirm
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedItem(null);
          }}
          onDeleteSuccess={handleDeleteSuccess}
          item={selectedItem}
        />
      </div>
    </div>
  );
}

export default App;
