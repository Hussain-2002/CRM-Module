import { useState, useEffect } from 'react';
import axios from 'axios';
import AddLeadForm from '../Components/AddLeadForm';
import LeadsPage from './LeadPage';
import MainLayout from '../Components/MainLayout';

const BASE_URL = 'http://localhost:5000/api/leads';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);

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
    <MainLayout activePage={activePage} onNavigate={setActivePage}>
      {activePage === 'dashboard' && (
        <h1 className="text-3xl font-bold">Welcome to Goanny Technology Dashboard</h1>
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
