import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const QuotationDetails = () => {
  const { id } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const response = await axios.get(`/api/quotations/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setQuotation(response.data);
      } catch (err) {
        console.error('Error fetching quotation:', err);
        setError('Quotation not found or failed to fetch.');
      }
    };

    fetchQuotation();
  }, [id]);

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!quotation) {
    return <div className="p-4">Loading quotation...</div>;
  }

  const {
    quotationId,
    status,
    createdAt,
    validUntil,
    customer,
    salesRep,
    items = [],
    totals = {},
    terms = {},
    notes,
    versions = [],
  } = quotation;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quotation #{quotationId}</h2>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Download PDF</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded">Send via Email</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-semibold">Customer</h3>
          <p>{customer?.name || '—'}</p>
          <p>{customer?.email || '—'}</p>
          <p>{customer?.billingAddress || '—'}</p>
        </div>

        <div>
          <h3 className="font-semibold">Quotation Info</h3>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Date:</strong> {new Date(createdAt).toLocaleDateString()}</p>
          <p><strong>Valid Until:</strong> {new Date(validUntil).toLocaleDateString()}</p>
          <p><strong>Sales Rep:</strong> {salesRep?.name || '—'}</p>
        </div>
      </div>

      <h3 className="font-semibold mb-2">Items</h3>
      <table className="w-full mb-6 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Product</th>
            <th className="border px-2 py-1">Qty</th>
            <th className="border px-2 py-1">Unit Price</th>
            <th className="border px-2 py-1">Discount</th>
            <th className="border px-2 py-1">Tax</th>
            <th className="border px-2 py-1">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{item.name}</td>
              <td className="border px-2 py-1">{item.quantity}</td>
              <td className="border px-2 py-1">₹{item.unitPrice}</td>
              <td className="border px-2 py-1">{item.discount}%</td>
              <td className="border px-2 py-1">{item.tax}%</td>
              <td className="border px-2 py-1">₹{item.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-6">
        <div className="text-right">
          <p><strong>Total Before Tax:</strong> ₹{totals?.totalBeforeTax}</p>
          <p><strong>Tax Amount:</strong> ₹{totals?.taxAmount}</p>
          <p className="text-xl font-bold"><strong>Grand Total:</strong> ₹{totals?.grandTotal}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold">Terms & Notes</h3>
        <p><strong>Payment Terms:</strong> {terms?.payment || '—'}</p>
        <p><strong>Delivery Terms:</strong> {terms?.delivery || '—'}</p>
        <p><strong>Notes:</strong> {notes || '—'}</p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Version History</h3>
        <ul className="border rounded p-3 bg-gray-50">
          {versions.length === 0 ? (
            <li>No previous versions found.</li>
          ) : (
            versions.map((v, idx) => (
              <li key={idx} className="mb-2 border-b pb-2">
                <p><strong>Version:</strong> {v.versionNumber}</p>
                <p><strong>Date:</strong> {v.date ? new Date(v.date).toLocaleString() : '—'}</p>
                <p><strong>Changes:</strong> {v.notes || '—'}</p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default QuotationDetails;
