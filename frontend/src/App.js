import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './pages/Dashboard';
import LeadsPage from './pages/LeadPage';
import AddLeadForm from './Components/AddLeadForm';
import Settings from './pages/Settings';
import MainLayout from './Components/MainLayout';
import LoginPage from './pages/LoginPage';       
import RegisterPage from './pages/RegisterPage';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [leads, setLeads] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);

  // Fetch leads on mount or when needed
  useEffect(() => {
    if (isLoggedIn && activePage === 'leads') {
      fetchLeads();
    }
  }, [isLoggedIn, activePage]);

  const fetchLeads = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/leads');
      setLeads(res.data);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      alert('Failed to load leads.');
    }
  };

  const handleAddLead = async (newLead) => {
    try {
      const res = await axios.post('http://localhost:5000/api/leads', newLead);
      setLeads((prev) => [...prev, res.data]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Add lead error:', error);
      alert('Failed to add lead.');
    }
  };

  const handleUpdateLead = async (updatedLead) => {
    try {
      await axios.put(`http://localhost:5000/api/leads/${updatedLead._id}`, updatedLead);
      setLeads((prev) =>
        prev.map((lead) => (lead._id === updatedLead._id ? updatedLead : lead))
      );
      setIsFormOpen(false);
      setLeadToEdit(null);
    } catch (error) {
      console.error('Update lead error:', error);
      alert('Failed to update lead.');
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/leads/${id}`);
      setLeads((prev) => prev.filter((lead) => lead._id !== id));
    } catch (error) {
      console.error('Delete lead error:', error);
      alert('Failed to delete lead.');
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

  // Auth handlers
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowRegister(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActivePage('dashboard');
  };

  if (!isLoggedIn) {
    return showRegister ? (
      <RegisterPage
        onRegisterSuccess={handleLoginSuccess}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <MainLayout
      activePage={activePage}
      onNavigate={setActivePage}
      onLogout={handleLogout}
    >
      {activePage === 'dashboard' && (
        <Dashboard activePage={activePage} setActivePage={setActivePage} />
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

      {activePage === 'settings' && <Settings />}
    </MainLayout>
  );
}

export default App;
