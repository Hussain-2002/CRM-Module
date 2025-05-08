import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
// You no longer need to route to LeadPage, AddLeadForm, or Settings directly

function App() {
  return (
    <Router>
      <Routes>
        {/* All internal navigation (leads, settings, etc.) is handled inside Dashboard */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
