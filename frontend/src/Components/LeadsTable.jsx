import React, { useState, useEffect } from 'react';

const LeadsTable = ({ leads, onEdit, onDelete, onViewDetails }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedLeads, setSortedLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 5;

  // Sort state: column and direction
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  // Keep sortedLeads in sync with leads prop and apply sorting/filtering
  useEffect(() => {
    setSortedLeads(leads);
    setCurrentPage(1); // reset page on leads change
  }, [leads]);

  // Toggle sorting by column and direction
  const handleSort = (column) => {
    let direction = 'asc';
    if (sortColumn === column && sortDirection === 'asc') {
      direction = 'desc';
    }
    setSortColumn(column);
    setSortDirection(direction);

    const sorted = [...leads].sort((a, b) => {
      // Make sure to handle undefined/null values gracefully
      const aVal = a[column] ? a[column].toString().toLowerCase() : '';
      const bVal = b[column] ? b[column].toString().toLowerCase() : '';
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setSortedLeads(sorted);
    setCurrentPage(1);
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Filter leads based on search query
  const filteredLeads = sortedLeads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${lead.firstName || ''} ${lead.lastName || ''}`.toLowerCase();
    return (
      fullName.includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.phone?.toLowerCase().includes(query) ||
      lead.companyName?.toLowerCase().includes(query)
    );
  });

  // Pagination logic
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  // Delete confirmation handler
  const handleDelete = () => {
    if (leadToDelete) {
      onDelete(leadToDelete._id);
      setShowDeleteConfirm(false);
      setLeadToDelete(null);
    }
  };

  // Status color helper
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

  // Render sort arrow for UI feedback
  const renderSortArrow = (column) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <div className="p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by name, email, phone, or company"
          className="px-4 py-2 border border-gray-300 rounded w-full sm:w-1/3"
        />
      </div>

      {filteredLeads.length === 0 ? (
        <p className="p-4 text-gray-600 text-center">No leads found.</p>
      ) : (
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="px-4 py-2 border cursor-pointer select-none"
                onClick={() => handleSort('firstName')}
              >
                Name{renderSortArrow('firstName')}
              </th>
              <th
                className="px-4 py-2 border cursor-pointer select-none"
                onClick={() => handleSort('email')}
              >
                Email{renderSortArrow('email')}
              </th>
              <th className="px-4 py-2 border">Phone</th>
              <th
                className="px-4 py-2 border cursor-pointer select-none"
                onClick={() => handleSort('status')}
              >
                Status{renderSortArrow('status')}
              </th>
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
          className={`px-4 py-2 rounded text-gray-700 ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'}`}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          className={`px-4 py-2 rounded text-gray-700 ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'}`}
          disabled={currentPage === totalPages}
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
