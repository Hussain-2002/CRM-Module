import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import LeadsTable from '../Components/LeadsTable';

const LeadDetails = ({ lead, onClose }) => {
  const fullName = `${lead?.firstName || ''} ${lead?.lastName || ''}`.trim();
  const company = lead?.companyName || lead?.company || 'N/A';
  const employees = lead?.numberOfEmployees ?? lead?.numOfEmployees ?? 'N/A';
  const address =
    lead?.address ||
    [lead?.street, lead?.city, lead?.state, lead?.zipCode, lead?.country]
      .filter(Boolean)
      .join(', ') ||
    'N/A';

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-xl w-full">
      <h3 className="text-xl font-semibold mb-4">Lead Details</h3>
      <ul className="space-y-2">
        <li><strong>Name:</strong> {fullName || 'N/A'}</li>
        <li><strong>Email:</strong> {lead?.email || 'N/A'}</li>
        <li><strong>Phone:</strong> {lead?.phone || 'N/A'}</li>
        <li><strong>Company:</strong> {company}</li>
        <li><strong>Status:</strong> {lead?.status || 'N/A'}</li>
        <li><strong>Lead Source:</strong> {lead?.leadSource || 'N/A'}</li>
        <li><strong>Industry:</strong> {lead?.industry || 'N/A'}</li>
        <li><strong>Annual Revenue:</strong> {lead?.annualRevenue || 'N/A'}</li>
        <li><strong>Employees:</strong> {employees}</li>
        <li><strong>Address:</strong> {address}</li>
      </ul>
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

const LeadsPage = ({ leads, setLeads, onDeleteLead, onOpenForm }) => {
  const [statusFilter, setStatusFilter] = useState('');
  const [viewLeadDetails, setViewLeadDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const leadsPerPage = 10;
  const filteredLeads = leads.filter((lead) =>
    statusFilter ? lead.status === statusFilter : true
  );
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const indexOfLastLead = currentPage * leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfLastLead - leadsPerPage, indexOfLastLead);

  const handleExportCSV = () => {
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Company',
      'Status',
      'Lead Source',
      'Industry',
      'Annual Revenue',
      'Number of Employees',
      'Address',
    ];

    const rows = filteredLeads.map((lead) => [
      lead.firstName || '',
      lead.lastName || '',
      lead.email || '',
      lead.phone || '',
      lead.companyName || lead.company || '',
      lead.status || '',
      lead.leadSource || '',
      lead.industry || '',
      lead.annualRevenue || '',
      lead.numberOfEmployees ?? lead.numOfEmployees ?? '',
      [lead.street, lead.city, lead.state, lead.zipCode, lead.country].filter(Boolean).join(', '),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        if (results.errors.length > 0) {
          alert(`CSV parsing error: ${results.errors.map(err => err.message).join(', ')}`);
          return;
        }

        const rows = results.data;
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'companyName'];

        const invalidRows = rows.filter((row) =>
          requiredFields.some((field) => !row[field]?.trim())
        );

        if (invalidRows.length > 0) {
          alert(
            `Import failed. ${invalidRows.length} row(s) missing required fields:\n${requiredFields.join(', ')}`
          );
          return;
        }

        try {
          const response = await axios.post('http://localhost:5000/api/leads/import', rows);
          const newlyAddedLeads = Array.isArray(response.data) ? response.data : [response.data];

          setLeads((prev) => [...prev, ...newlyAddedLeads]);

          alert('CSV imported successfully!');
        } catch (error) {
          console.error('Bulk CSV Import Error:', error);
          alert('Error importing leads in bulk.');
        }
      },
    });
  };

  const handleDownloadTemplate = () => {
    const headers = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'companyName',
      'status',
      'leadSource',
      'industry',
      'annualRevenue',
      'numberOfEmployees',
      'street',
      'city',
      'state',
      'zipCode',
      'country',
    ];
    const csv = headers.join(',') + '\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lead-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Leads</h2>

      <div className="flex items-center flex-wrap gap-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-4 py-2 w-full sm:w-48"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="qualified">Qualified</option>
          <option value="unqualified">Unqualified</option>
        </select>

        <button
          onClick={() => onOpenForm(null)}
          className="px-4 py-2 bg-[#174E63] text-white rounded"
        >
          Add New Lead
        </button>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Export CSV
        </button>

        <div className="relative">
          <label
            htmlFor="csvInput"
            className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded inline-block"
          >
            Import File
          </label>
          <input
            id="csvInput"
            type="file"
            accept=".csv"
            onChange={handleImportCSV}
            className="hidden"
          />
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Download Template
        </button>
      </div>

      <LeadsTable
        leads={currentLeads}
        onEdit={onOpenForm}
        onDelete={onDeleteLead}
        onViewDetails={setViewLeadDetails}
      />

      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 border-blue-600'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {viewLeadDetails && (
        <LeadDetails lead={viewLeadDetails} onClose={() => setViewLeadDetails(null)} />
      )}
    </div>
  );
};

export default LeadsPage;
