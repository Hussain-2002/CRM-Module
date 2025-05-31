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
      closeForm();
    } catch (error) {
      console.error('Failed to submit lead:', error);
      alert('Error submitting lead. Please try again.');
    }
  };

  const statusOptions = ['New', 'Contacted', 'Converted', 'Qualified', 'Unqualified'];
  const ratingOptions = ['Hot', 'Warm', 'Cold'];

  const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-7xl mx-auto space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">{leadToEdit ? 'Edit Lead' : 'Add Lead'}</h2>

      {/* Group 1: Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-blue-600">Basic Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['leadOwnerName', 'companyName', 'firstName', 'lastName', 'title', 'email', 'phone'].map((field) => (
            <div key={field}>
              <label className={labelClass}>
                {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <input
                type={field.toLowerCase().includes('email') ? 'email' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className={inputClass}
                required={['firstName', 'companyName', 'leadOwnerName', 'email', 'phone'].includes(field)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Group 2: Lead Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-blue-600">Lead Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['fax', 'leadSource', 'industry', 'numberOfEmployees', 'annualRevenue', 'teamId'].map((field) => (
            <div key={field}>
              <label className={labelClass}>
                {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          ))}
          <div>
            <label className={labelClass}>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status.toLowerCase()}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Rating</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Rating</option>
              {ratingOptions.map((rating) => (
                <option key={rating} value={rating.toLowerCase()}>{rating}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Group 3: Contact Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-blue-600">Contact Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['secondaryEmail', 'twitter', 'street', 'city', 'state', 'zipCode', 'country'].map((field) => (
            <div key={field}>
              <label className={labelClass}>
                {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Group 4: Description */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-blue-600">Additional Info</h3>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={inputClass}
          placeholder="Enter any additional notes..."
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={closeForm}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {leadToEdit ? 'Update Lead' : 'Add Lead'}
        </button>
      </div>
    </form>
  );
};

export default AddLeadForm;
