import React, { useState, useEffect } from 'react';
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';

const capitalizeWords = (str) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const LeadsTable = ({ leads, onEdit, onDelete, onViewDetails }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedLeads, setSortedLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 5;

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  useEffect(() => {
    let updatedLeads = [...leads];

    if (sortColumn) {
      updatedLeads.sort((a, b) => {
        const aVal = a[sortColumn]?.toString().toLowerCase() || '';
        const bVal = b[sortColumn]?.toString().toLowerCase() || '';
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setSortedLeads(updatedLeads);
    setCurrentPage(1);
  }, [leads, sortColumn, sortDirection]);

  const handleSort = (column) => {
    let direction = 'asc';
    if (sortColumn === column && sortDirection === 'asc') {
      direction = 'desc';
    }
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

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

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const handleDelete = () => {
    if (leadToDelete) {
      onDelete(leadToDelete._id);
      setShowDeleteConfirm(false);
      setLeadToDelete(null);
    }
  };

  const renderSortArrow = (column) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <div className="p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by name, email, phone, or company"
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded w-full sm:w-1/3"
        />
      </div>

      {filteredLeads.length === 0 ? (
        <p className="p-4 text-gray-600 dark:text-gray-300 text-center">No leads found.</p>
      ) : (
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <tr>
              <th className="px-4 py-2 border dark:border-gray-600 cursor-pointer" onClick={() => handleSort('firstName')}>
                Name{renderSortArrow('firstName')}
              </th>
              <th className="px-4 py-2 border dark:border-gray-600 cursor-pointer" onClick={() => handleSort('email')}>
                Email{renderSortArrow('email')}
              </th>
              <th className="px-4 py-2 border dark:border-gray-600">Phone</th>
              <th className="px-4 py-2 border dark:border-gray-600 cursor-pointer" onClick={() => handleSort('status')}>
                Status{renderSortArrow('status')}
              </th>
              <th className="px-4 py-2 border dark:border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800">
            {currentLeads.map((lead) => {
              const fullName = capitalizeWords(`${lead.firstName || ''} ${lead.lastName || ''}`.trim());
              const email = lead.email ? capitalizeFirstLetter(lead.email) : 'N/A';
              return (
                <tr key={lead._id} className="text-gray-800 dark:text-gray-100">
                  <td className="px-4 py-2 border dark:border-gray-600">{fullName}</td>
                  <td className="px-4 py-2 border dark:border-gray-600">{email}</td>
                  <td className="px-4 py-2 border dark:border-gray-600">{lead.phone || 'N/A'}</td>
                  <td className="px-4 py-2 border dark:border-gray-600 capitalize">{lead.status || 'N/A'}</td>
                  <td className="px-4 py-2 border dark:border-gray-600 text-center space-x-3">
                    <button
                      onClick={() => onViewDetails(lead)}
                      aria-label="View lead"
                      className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <FiEye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onEdit(lead)}
                      aria-label="Edit lead"
                      className="hover:text-yellow-600 dark:hover:text-yellow-400"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setLeadToDelete(lead);
                        setShowDeleteConfirm(true);
                      }}
                      aria-label="Delete lead"
                      className="hover:text-red-600 dark:hover:text-red-400"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center p-4">
        <button
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          className={`px-4 py-2 rounded text-gray-800 dark:text-gray-200 ${
            currentPage === 1
              ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
              : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
          }`}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="text-gray-700 dark:text-gray-200">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          className={`px-4 py-2 rounded text-gray-800 dark:text-gray-200 ${
            currentPage === totalPages
              ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
              : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
          }`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-11/12 sm:w-1/3">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Confirm Delete</h3>
            <p className="text-gray-700 dark:text-gray-200">Are you sure you want to delete this lead?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-400 dark:bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
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
