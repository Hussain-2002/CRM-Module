import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AddLeadForm from '../Components/AddLeadForm';
import LeadsPage from './LeadPage';
import SummaryCard from '../Components/SummaryCard';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Chart from '../Components/Chart';  // Import the Chart component

const BASE_URL = 'http://localhost:5000/api/leads';

const Dashboard = ({ activePage, setActivePage }) => {
  const [leads, setLeads] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [stats, setStats] = useState({});
  const [barData, setBarData] = useState({});
  const [viewMode, setViewMode] = useState('year');
  const barChartRef = useRef();  // Ref for the Bar chart
  const exportRef = useRef();

  // Fetch leads from API
  const fetchLeads = async () => {
    try {
      const response = await axios.get(BASE_URL);
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  // Fetch stats from API
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/stats`);
      setStats({ ...response.data.statusCounts });
    } catch (error) {
      console.error('Error fetching lead stats:', error);
    }
  };

  // Fetch bar chart data from API
  const fetchBarData = async (type = 'year') => {
    try {
      const response = await axios.get(`${BASE_URL}/bar-stats?type=${type}`);
      setBarData({ ...response.data });
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchStats();
    fetchBarData(viewMode);
  }, [viewMode]);

  const handleAddLead = async (newLead) => {
    try {
      await axios.post(BASE_URL, newLead);
      await fetchLeads();
      await fetchStats();
      await fetchBarData(viewMode);
      setIsFormOpen(false);
      setLeadToEdit(null);
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  const handleUpdateLead = async (updatedLead) => {
    try {
      const leadId = updatedLead.id || updatedLead._id;
      await axios.put(`${BASE_URL}/${leadId}`, updatedLead);
      await fetchLeads();
      await fetchStats();
      await fetchBarData(viewMode);
      setIsFormOpen(false);
      setLeadToEdit(null);
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      await fetchLeads();
      await fetchStats();
      await fetchBarData(viewMode);
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  // Updated handleExportChart function to properly access chart image
  const handleExportChart = () => {
    const chartInstance = barChartRef.current;
    if (chartInstance) {
      // For react-chartjs-2 v4, the ref points directly to Chart.js instance
      const base64Image = chartInstance.toBase64Image();
      const link = document.createElement('a');
      link.href = base64Image;
      link.download = `leads-${viewMode}-chart.png`;
      link.click();
    } else {
      console.warn('Chart reference is not available');
    }
  };

  const handleExportPDF = () => {
    const input = exportRef.current;
    if (!input) return;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`leads-dashboard-${viewMode}.pdf`);
    });
  };

  const handleOpenForm = (lead = null) => {
    setIsFormOpen(true);
    setLeadToEdit(lead);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setLeadToEdit(null);
  };
 


  return (
    <>
      {activePage === 'dashboard' && (
        <div ref={exportRef}>
          <h1 className="text-3xl font-bold mb-6">Welcome to Goanny Technology Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <SummaryCard
              title="Total Leads"
              value={leads.length}
              bgColor="bg-blue-100"
              textColor="text-blue-800"
            />
            <SummaryCard
              title="Converted Leads"
              value={stats.converted || 0}
              bgColor="bg-green-100"
              textColor="text-green-800"
            />
          </div>

          <Chart
            key={viewMode}
            stats={stats}
            barData={barData}
            viewMode={viewMode}
            setViewMode={setViewMode}
            handleExportChart={handleExportChart}
            barChartRef={barChartRef}
          />

          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleExportPDF}
              className="text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Export Dashboard PDF
            </button>
          </div>
        </div>
      )}

      {activePage === 'leads' && !isFormOpen && (
        <LeadsPage
          leads={leads}
          setLeads={setLeads}
          onDeleteLead={handleDeleteLead}
          onOpenForm={handleOpenForm}
        />
      )}

      {activePage === 'leads' && isFormOpen && (
        <AddLeadForm
          onSubmit={leadToEdit ? handleUpdateLead : handleAddLead}
          leadToEdit={leadToEdit}
          closeForm={handleCloseForm}
        />
      )}
    </>
  );
};

export default Dashboard;
