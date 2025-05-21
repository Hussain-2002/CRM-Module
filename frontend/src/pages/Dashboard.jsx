import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SummaryCard from '../Components/SummaryCard';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Chart from '../Components/Chart';

const BASE_URL = 'http://localhost:5000/api/leads';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({});
  const [barData, setBarData] = useState({});
  const [viewMode, setViewMode] = useState('year');

  const barChartRef = useRef(null);
  const exportRef = useRef(null);

  useEffect(() => {
    fetchLeads();
    fetchStats();
    fetchBarData(viewMode);
  }, [viewMode]);

  const fetchLeads = async () => {
    try {
      const { data } = await axios.get(BASE_URL);
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/stats`);
      setStats({ ...data.statusCounts });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchBarData = async (type = 'year') => {
    try {
      const { data } = await axios.get(`${BASE_URL}/bar-stats?type=${type}`);
      setBarData({ ...data });
    } catch (error) {
      console.error('Error fetching bar data:', error);
    }
  };

  const handleExportChart = () => {
    const chartInstance = barChartRef.current;
    if (chartInstance && chartInstance.toBase64Image) {
      const base64Image = chartInstance.toBase64Image();
      const link = document.createElement('a');
      link.href = base64Image;
      link.download = `leads-${viewMode}-chart.png`;
      link.click();
    } else {
      console.warn('Chart reference is not available or invalid');
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

  return (
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
  );
};

export default Dashboard;
