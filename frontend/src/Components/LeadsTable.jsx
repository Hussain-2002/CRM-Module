import React, { useState, useEffect } from 'react';

const LeadsTable = ({ leads, onEdit, onDelete, onViewDetails }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedLeads, setSortedLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 5;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  useEffect(() => {
    setSortedLeads(leads); // Keep sortedLeads in sync with new props
  }, [leads]);

  const handleDelete = () => {
    if (leadToDelete) {
      onDelete(leadToDelete._id);
      setShowDeleteConfirm(false);
      setLeadToDelete(null);
    }
  };

  const getStatusColor = (status = '') => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-500';
      case 'contacted':
        return 'bg-yellow-500';
      case 'converted':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    const sorted = [...leads].sort((a, b) => {
      if (a[column] < b[column]) return -1;
      if (a[column] > b[column]) return 1;
      return 0;
    });
    setSortedLeads(sorted);
  };

  const filteredLeads = sortedLeads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    return (
      lead.firstName?.toLowerCase().includes(query) ||
      lead.lastName?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query)
    );
  });

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <div className="p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by name or email"
          className="px-4 py-2 border border-gray-300 rounded w-full sm:w-1/3"
        />
      </div>

      {filteredLeads.length === 0 ? (
        <p className="p-4 text-gray-600 text-center">No leads found.</p>
      ) : (
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border cursor-pointer" onClick={() => handleSort('firstName')}>Name</th>
              <th className="px-4 py-2 border cursor-pointer" onClick={() => handleSort('email')}>Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border cursor-pointer" onClick={() => handleSort('status')}>Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.map((lead) => (
              <tr key={lead._id}>
                <td className="px-4 py-2 border">{`${lead.firstName || ''} ${lead.lastName || ''}`}</td>
                <td className="px-4 py-2 border">{lead.email || 'N/A'}</td>
                <td className="px-4 py-2 border">{lead.phone || 'N/A'}</td>
                <td className="px-4 py-2 border">
                  <span className={`text-white px-2 py-1 rounded ${getStatusColor(lead.status)}`}>
                    {lead.status || 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => onViewDetails(lead)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(lead)}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setLeadToDelete(lead);
                      setShowDeleteConfirm(true);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center p-4">
        <button
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          className="px-4 py-2 bg-gray-300 rounded text-gray-700"
        >
          Prev
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          className="px-4 py-2 bg-gray-300 rounded text-gray-700"
        >
          Next
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 sm:w-1/3">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this lead?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;
