import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AddLeadForm from '../Components/AddLeadForm';
import LeadsPage from './LeadPage';
import MainLayout from '../Components/MainLayout';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const BASE_URL = 'http://localhost:5000/api/leads';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [stats, setStats] = useState({});
  const [barData, setBarData] = useState({});
  const [viewMode, setViewMode] = useState('year'); // "year" | "month"
  const barChartRef = useRef();

  const fetchLeads = async () => {
    try {
      const response = await axios.get(BASE_URL);
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/stats`);
      setStats(response.data.statusCounts || {});
    } catch (error) {
      console.error('Error fetching lead stats:', error);
    }
  };

  const fetchBarData = async (type = 'year') => {
    try {
      const response = await axios.get(`${BASE_URL}/bar-stats?type=${type}`);
      setBarData(response.data);
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
    const confirmDelete = window.confirm('Are you sure you want to delete this lead?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}/${id}`);
      await fetchLeads();
      await fetchStats();
      await fetchBarData(viewMode);
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleOpenForm = (lead = null) => {
    setLeadToEdit(lead);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setLeadToEdit(null);
  };

  const handleExportChart = () => {
    const chart = barChartRef.current;
    if (chart) {
      const url = chart.toBase64Image();
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-${viewMode}-chart.png`;
      link.click();
    }
  };

  const pieChartData = {
    labels: Object.keys(stats),
    datasets: [
      {
        label: 'Leads by Status',
        data: Object.values(stats),
        backgroundColor: ['#60a5fa', '#34d399', '#facc15', '#f87171', '#a78bfa'],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: barData.labels || [],
    datasets: [
      {
        label: 'Leads',
        data: barData.values || [],
        backgroundColor: '#4f46e5',
      },
    ],
  };

  return (
    <MainLayout activePage={activePage} onNavigate={setActivePage}>
      {activePage === 'dashboard' && (
        <div>
          <h1 className="text-3xl font-bold mb-6">Welcome to Goanny Technology Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-blue-100 text-blue-800 rounded shadow">
              <h3 className="text-lg font-semibold">Total Leads</h3>
              <p className="text-2xl">{leads.length}</p>
            </div>
            <div className="p-4 bg-green-100 text-green-800 rounded shadow">
              <h3 className="text-lg font-semibold">Converted Leads</h3>
              <p className="text-2xl">{stats.converted || 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Lead Status Distribution</h3>
              <div className="w-full h-[300px] flex justify-center items-center">
                <div className="w-[280px] h-[280px]">
                  <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Lead Trends ({viewMode})</h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="year">Yearly</option>
                    <option value="month">Monthly</option>
                  </select>
                  <button
                    onClick={handleExportChart}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Export
                  </button>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <Bar
                  ref={barChartRef}
                  data={barChartData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
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
    </MainLayout>
  );
};

export default Dashboard;
