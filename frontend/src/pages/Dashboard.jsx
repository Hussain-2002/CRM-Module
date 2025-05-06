import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Components/Header';
import AddLeadForm from '../Components/AddLeadForm';
import LeadsPage from './LeadPage';

const BASE_URL = 'http://localhost:5000/api/leads';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const handleNavigation = (page) => {
    setActivePage(page);
    setIsFormOpen(false);
    setLeadToEdit(null);
    setSidebarOpen(false);
  };

  const fetchLeads = async () => {
    try {
      const response = await axios.get(BASE_URL);
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleAddLead = async (newLead) => {
    try {
      await axios.post(BASE_URL, newLead);
      await fetchLeads();
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

  return (
    <div className="flex">
      {sidebarOpen && (
        <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          <nav className="flex flex-col space-y-4">
            <button className="hover:bg-gray-700 p-2 rounded" onClick={() => handleNavigation('dashboard')}>
              Dashboard
            </button>
            <button className="hover:bg-gray-700 p-2 rounded" onClick={() => handleNavigation('leads')}>
              Leads
            </button>
          </nav>
        </aside>
      )}

      <div className="flex-1">
        <Header onMenuClick={toggleSidebar} />
        <main className="p-6 overflow-auto">
          {activePage === 'dashboard' && (
            <h1 className="text-3xl font-bold">Welcome to Goanny Technology Dashboard</h1>
          )}

        {activePage === 'leads' && !isFormOpen && (
        <>
            {/* ✅ Allow LeadsPage to update leads after CSV import */}
            <LeadsPage
            leads={leads}
            setLeads={setLeads}
            onDeleteLead={handleDeleteLead}
            onOpenForm={handleOpenForm}
            />
        </>
)}

          {activePage === 'leads' && isFormOpen && (
            <AddLeadForm
              onSubmit={leadToEdit ? handleUpdateLead : handleAddLead}
              leadToEdit={leadToEdit}
              closeForm={handleCloseForm}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
