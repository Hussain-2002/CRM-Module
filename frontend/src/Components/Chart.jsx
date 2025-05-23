import React from 'react';
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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Chart = ({
  stats,
  barData,
  viewMode,
  setViewMode,
  handleExportChart,
  barChartRef,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const pieChartData = {
    labels: Object.keys(stats),
    datasets: [
      {
        label: 'Leads by Status',
        data: Object.values(stats),
        backgroundColor: [
          '#60a5fa', '#34d399', '#facc15', '#f87171',
          '#a78bfa', '#f97316', '#06b6d4'
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: barData.labels || [],
    datasets: Object.entries(barData.datasets || {}).map(([status, values], idx) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      data: values,
      backgroundColor: [
        '#60a5fa', '#34d399', '#facc15', '#f87171',
        '#a78bfa', '#f97316', '#06b6d4'
      ][idx % 7],
    })),
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <div className="bg-white dark:bg-gray-800 rounded shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Lead Status Distribution</h3>
        <div className="w-full h-[300px] flex justify-center items-center">
          <div className="w-[280px] h-[280px]">
            <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded shadow p-6">
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
                  onChange={(date) => setStartDate(date)}
                  placeholderText="Start Date"
                  className="border rounded px-2 py-1 text-sm"
                  maxDate={endDate || new Date()}
                  isClearable
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
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
          <Bar
            ref={barChartRef}
            data={barChartData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chart;
