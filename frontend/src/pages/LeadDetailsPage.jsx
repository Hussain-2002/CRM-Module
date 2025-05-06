const LeadDetails = ({ lead, onClose }) => (
  <div className="p-6 border rounded-lg bg-white shadow-md fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-xl w-full">
    <h3 className="text-2xl font-semibold mb-4">Lead Details</h3>
    <ul className="space-y-2 text-gray-800">
      <li><strong>Name:</strong> {`${lead?.firstName || ''} ${lead?.lastName || ''}`}</li>
      <li><strong>Email:</strong> {lead?.email || 'N/A'}</li>
      <li><strong>Phone:</strong> {lead?.phone || 'N/A'}</li>
      <li><strong>Company:</strong> {lead?.company || 'N/A'}</li>
      <li><strong>Status:</strong> {lead?.status || 'N/A'}</li>
      <li><strong>Lead Source:</strong> {lead?.leadSource || 'N/A'}</li>
      <li><strong>Industry:</strong> {lead?.industry || 'N/A'}</li>
      <li><strong>Annual Revenue:</strong> {lead?.annualRevenue || 'N/A'}</li>
      <li><strong>Employees:</strong> {lead?.numOfEmployees || 'N/A'}</li>
      <li><strong>Address:</strong> {lead?.address || 'N/A'}</li>
    </ul>
    <div className="text-right mt-6">
      <button
        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
);
export default LeadDetails;