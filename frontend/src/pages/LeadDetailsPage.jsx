import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const LeadDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/leads/${id}`);
        setLead(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch lead details.');
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-40">
        <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
          Loading lead details...
        </span>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-600 dark:text-red-400">{error}</div>;
  }

  const fullName = `${lead?.firstName || ''} ${lead?.lastName || ''}`.trim() || 'N/A';
  const fullAddress = [
    lead?.street,
    lead?.city,
    lead?.state,
    lead?.zipCode,
    lead?.country,
  ]
    .filter(Boolean)
    .join(', ') || 'N/A';

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow rounded-md mt-10 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Lead Details</h2>
        <button
          onClick={() => navigate('/leads')}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          title="Back to Leads"
        >
          <ArrowLeftIcon className="h-6 w-6" />
          <span className="sr-only">Back to Leads</span>
        </button>
      </div>

      <ul className="space-y-3 text-gray-700 dark:text-gray-300">
        <li><strong>Lead Owner:</strong> {lead?.leadOwnerName || 'N/A'}</li>
        <li><strong>Name:</strong> {fullName}</li>
        <li><strong>Title:</strong> {lead?.title || 'N/A'}</li>
        <li><strong>Email:</strong> {lead?.email || 'N/A'}</li>
        <li><strong>Secondary Email:</strong> {lead?.secondaryEmail || 'N/A'}</li>
        <li><strong>Phone:</strong> {lead?.phone || 'N/A'}</li>
        <li><strong>Fax:</strong> {lead?.fax || 'N/A'}</li>
        <li><strong>Company:</strong> {lead?.companyName || 'N/A'}</li>
        <li><strong>Status:</strong> {lead?.status || 'N/A'}</li>
        <li><strong>Lead Source:</strong> {lead?.leadSource || 'N/A'}</li>
        <li><strong>Industry:</strong> {lead?.industry || 'N/A'}</li>
        <li><strong>Annual Revenue:</strong> {lead?.annualRevenue || 'N/A'}</li>
        <li><strong>Employees:</strong> {lead?.numberOfEmployees != null ? lead.numberOfEmployees : 'N/A'}</li>
        <li><strong>Rating:</strong> {lead?.rating || 'N/A'}</li>
        <li><strong>Twitter:</strong> {lead?.twitter || 'N/A'}</li>
        <li><strong>Address:</strong> {fullAddress}</li>
        <li><strong>Description:</strong> {lead?.description || 'N/A'}</li>
      </ul>
    </div>
  );
};

export default LeadDetailsPage;
