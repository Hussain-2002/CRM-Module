import React, { useRef } from 'react';
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
import * as htmlToImage from 'html-to-image';

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
  barChartRef = null,
  startDate = null,
  setStartDate = () => {},
  endDate = null,
  setEndDate = () => {},
  retentionData = [],
  winRateData = [],
}) => {
  const exportRef = useRef();

  const handleExportChart = () => {
    const node = exportRef.current;

    htmlToImage
      .toPng(node, {
        backgroundColor: '#ffffff',
        style: {
          color: '#000000', // Prevent oklch parsing issues
        },
      })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'dashboard-chart.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('Export error:', error);
      });
  };

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

  const barChartData = {
    labels: barData.labels || [],
    datasets: Object.entries(barData.datasets || {}).map(([status, values]) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      data: values,
      backgroundColor: STATUS_COLORS[status] || '#ccc',
    })),
  };

  const miniLineOptions = {
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
    elements: { line: { tension: 0.4 }, point: { radius: 0 } },
    responsive: true,
    maintainAspectRatio: false,
  };

  const retentionChartData = {
    labels: retentionData.length ? retentionData.map((_, i) => i + 1) : [],
    datasets: [
      {
        label: 'Customer Retention',
        data: retentionData,
        borderColor: '#10b981',
        backgroundColor: '#10b98133',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const winRateBarData = {
    labels: barData.labels.length ? barData.labels : winRateData.map((_, i) => `Month ${i + 1}`),
    datasets: [
      {
        label: 'Lead Win Rate (%)',
        data: winRateData,
        backgroundColor: '#3b82f6',
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
    <div className="space-y-6">
      {/* Export Button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={handleExportChart}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Export Dashboard Chart
        </button>
      </div>

      {/* Exportable Chart Section */}
      <div ref={exportRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Lead Status Distribution</h3>
          <div className="w-full h-[300px] flex justify-center items-center">
            <div className="w-[280px] h-[280px]">
              <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        {/* Bar Chart */}
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

        {/* Customer Retention Trend (Full-Size Line Chart) */}
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Customer Retention Trend</h3>
          <div className="h-[300px] w-full">
            <Line
              data={retentionChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: { display: true, text: 'Month' },
                    ticks: {
                      callback: (val, index) =>
                        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index] || '',
                    },
                  },
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Retention (%)' },
                    ticks: {
                      callback: (val) => `${val}%`,
                    },
                  },
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.parsed.y}%`,
                    },
                  },
                },
                elements: {
                  line: { tension: 0.4 },
                  point: { radius: 3 },
                },
              }}
            />
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
    </div>
  );
};

export default Chart;