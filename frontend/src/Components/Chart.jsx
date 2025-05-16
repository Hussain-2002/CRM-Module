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

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Chart = ({ stats, barData, viewMode, setViewMode, handleExportChart, barChartRef }) => {
  const pieChartData = {
    labels: Object.keys(stats),
    datasets: [
      {
        label: 'Leads by Status',
        data: Object.values(stats),
        backgroundColor: ['#60a5fa', '#34d399', '#facc15', '#f87171', '#a78bfa'],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: barData.labels || [],
    datasets: [
      {
        label: 'Leads',
        data: barData.values || [],
        backgroundColor: '#4f46e5',
      },
    ],
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Lead Trends ({viewMode})</h3>
          <div className="flex items-center space-x-2">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="year">Yearly</option>
              <option value="month">Monthly</option>
            </select>
            <button
              onClick={handleExportChart}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Export
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
