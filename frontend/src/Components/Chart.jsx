import React from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const STATUS_COLORS = {
  converted: '#60a5fa',
  contacted: '#34d399',
  qualified: '#facc15',
  unqualified: '#f87171',
  new: '#a78bfa',
};

const Chart = ({
  stats = {},
  barData = { labels: [], datasets: {} },
  viewMode = 'year',
  setViewMode = () => {},
  handleExportChart = () => {},
  barChartRef = null,
  startDate = null,
  setStartDate = () => {},
  endDate = null,
  setEndDate = () => {},
  retentionData = [],
  winRateData = [],
}) => {
  // Pie Chart data
  const pieChartData = {
    labels: Object.keys(stats),
    datasets: [
      {
        label: 'Leads by Status',
        data: Object.values(stats),
        backgroundColor: Object.keys(stats).map(
          (status) => STATUS_COLORS[status] || '#ccc'
        ),
        borderWidth: 1,
      },
    ],
  };

  // Bar Chart for lead trends
  const barChartData = {
    labels: barData.labels || [],
    datasets: Object.entries(barData.datasets || {}).map(([status, values]) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      data: values,
      backgroundColor: STATUS_COLORS[status] || '#ccc',
    })),
  };

  // Mini line chart options for retention
  const miniLineOptions = {
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
    elements: { line: { tension: 0.4 }, point: { radius: 0 } },
    responsive: true,
    maintainAspectRatio: false,
  };

  // Inline mini line data for retention trend
  const retentionChartData = {
    labels: retentionData.length ? retentionData.map((_, i) => i + 1) : [],
    datasets: [
      {
        label: 'Customer Retention',
        data: retentionData,
        borderColor: '#10b981', // green
        backgroundColor: '#10b98133',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  // Bar chart data for Lead Win Rate with months as labels
  // Assuming winRateData is an array of numbers and barData.labels contains months
  const winRateBarData = {
    labels: barData.labels.length ? barData.labels : winRateData.map((_, i) => `Month ${i + 1}`),
    datasets: [
      {
        label: 'Lead Win Rate (%)',
        data: winRateData,
        backgroundColor: '#3b82f6', // blue
      },
    ],
  };

  const winRateBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (val) => `${val}%`,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y}%`,
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Lead Status Distribution</h3>
        <div className="w-full h-[300px] flex justify-center items-center">
          <div className="w-[280px] h-[280px]">
            <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Lead Trends Bar Chart */}
      <div className="bg-white rounded shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 className="text-xl font-semibold">Lead Trends ({viewMode})</h3>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="year">Yearly</option>
              <option value="month">Monthly</option>
              <option value="range">Date Range</option>
            </select>

            {viewMode === 'range' && (
              <div className="flex items-center gap-2">
                <DatePicker
                  selected={startDate}
                  onChange={setStartDate}
                  placeholderText="Start Date"
                  className="border rounded px-2 py-1 text-sm"
                  maxDate={endDate || new Date()}
                  isClearable
                />
                <DatePicker
                  selected={endDate}
                  onChange={setEndDate}
                  placeholderText="End Date"
                  className="border rounded px-2 py-1 text-sm"
                  minDate={startDate}
                  maxDate={new Date()}
                  isClearable
                />
              </div>
            )}

            <button
              onClick={handleExportChart}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Export Chart
            </button>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <Bar ref={barChartRef} data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Customer Retention Inline Line Chart */}
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Customer Retention Trend</h3>
        <div className="h-[100px]">
          <Line data={retentionChartData} options={miniLineOptions} />
        </div>
      </div>

      {/* Lead Win Rate Bar Chart */}
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Lead Win Rate (Monthly)</h3>
        <div className="h-[300px]">
          <Bar data={winRateBarData} options={winRateBarOptions} />
        </div>
      </div>
    </div>
  );
};

export default Chart;
