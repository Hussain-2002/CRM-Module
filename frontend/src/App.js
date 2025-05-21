import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import axios from 'axios';

import Dashboard from './pages/Dashboard';
import LeadsPage from './pages/LeadPage';
import LeadDetailsPage from './pages/LeadDetailsPage'; // <-- New import
import AddLeadForm from './Components/AddLeadForm';
import Settings from './pages/Settings';
import ProfilePage from './pages/Profile';
import MainLayout from './Components/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function AppWrapper() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [leads, setLeads] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      fetchLeads();
    }
  }, [isLoggedIn]);

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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowRegister(false);
    navigate('/dashboard'); // Redirect after login to /dashboard
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
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
    <MainLayout onLogout={handleLogout}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Lead listing + inline Add/Edit form */}
        <Route
          path="/leads"
          element={
            !isFormOpen ? (
              <LeadsPage
                leads={leads}
                setLeads={setLeads}
                onDeleteLead={handleDeleteLead}
                onOpenForm={(lead) => {
                  setLeadToEdit(lead);
                  setIsFormOpen(true);
                }}
              />
            ) : (
              <AddLeadForm
                onSubmit={leadToEdit ? handleUpdateLead : handleAddLead}
                leadToEdit={leadToEdit}
                closeForm={() => {
                  setIsFormOpen(false);
                  setLeadToEdit(null);
                }}
              />
            )
          }
        />

        {/* New Lead Details page route */}
        <Route
          path="/leads/:id"
          element={<LeadDetailsPage onDeleteLead={handleDeleteLead} />}
        />

        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Catch all fallback */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </MainLayout>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
