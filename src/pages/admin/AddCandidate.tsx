import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';

export default function AddCandidate() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    party: '',
    qualification: ''
  });
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/candidates', formData);
      setModalMessage('Candidate registration successful!');
      setShowModal(true);
      setFormData({ name: '', age: '', party: '', qualification: '' }); // Reset form
    } catch (error: any) {
      setModalMessage(error.response?.data?.error || 'Error registering candidate');
      setShowModal(true);
    }
  };

  return (
    <Layout type="admin">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Candidate</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                min="18"
                max="80"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Party</label>
              <input
                type="text"
                name="party"
                value={formData.party}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register Candidate
            </button>
          </form>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-lg font-semibold mb-4">{modalMessage}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
