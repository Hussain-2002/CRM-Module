import { useState, useEffect } from 'react';

const AddLeadForm = ({ onSubmit, leadToEdit, closeForm }) => {
  const [formData, setFormData] = useState({
    leadOwnerName: '',
    companyName: '',
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    fax: '',
    leadSource: '',
    status: '',
    industry: '',
    numberOfEmployees: '',
    annualRevenue: '',
    rating: '',
    teamId: '',
    secondaryEmail: '',
    twitter: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    description: '',
  });

  useEffect(() => {
    if (leadToEdit) {
      setFormData(prev => ({ ...prev, ...leadToEdit }));
    }
  }, [leadToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      closeForm(); // Close form after successful submit
    } catch (error) {
      console.error('Failed to submit lead:', error);
      alert('Error submitting lead. Please try again.');
    }
  };

  return (
    <div className="p-4 bg-white border rounded shadow mb-8">
      <h2 className="text-xl font-semibold mb-6">
        {leadToEdit ? 'Edit Lead' : 'Add Lead'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Group 1: Basic Info */}
        <div>
          <h3 className="text-blue-600 font-medium mb-2">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['leadOwnerName', 'companyName', 'firstName', 'lastName', 'title', 'email', 'phone'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1">
                  {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <input
                  type={field.toLowerCase().includes('email') ? 'email' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required={['firstName', 'companyName', 'leadOwnerName', 'email', 'phone'].includes(field)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Group 2: Lead Details */}
        <div>
          <h3 className="text-blue-600 font-medium mb-2">Lead Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['fax', 'leadSource', 'status', 'industry', 'numberOfEmployees', 'annualRevenue', 'rating', 'teamId'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1">
                  {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Group 3: Contact Info */}
        <div>
          <h3 className="text-blue-600 font-medium mb-2">Contact Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['secondaryEmail', 'twitter', 'street', 'city', 'state', 'zipCode', 'country'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1">
                  {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Group 4: Description */}
        <div>
          <h3 className="text-blue-600 font-medium mb-2">Additional Info</h3>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded"
            rows={4}
            placeholder="Enter any additional notes..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={closeForm}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {leadToEdit ? 'Update Lead' : 'Add Lead'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLeadForm;
