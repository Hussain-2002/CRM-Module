import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LeadPage from './pages/LeadPage';
import LeadDetailsPage from './pages/LeadDetailsPage';
import AddLeadForm from './Components/AddLeadForm'; // Import AddLeadForm as a page

function App() {
  return (
    <Router>
      <Routes>
        {/* Home route for the dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Route for Leads list */}
        <Route path="/leads" element={<LeadPage />} />

        {/* Route for Lead Details */}
        <Route path="/leads/:leadId" element={<LeadDetailsPage />} />

        {/* New Route: Add Lead Form Page (same layout retained) */}
        <Route path="/leads/add" element={<AddLeadForm />} />
      </Routes>
    </Router>
  );
}

export default App;
