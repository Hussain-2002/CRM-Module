import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';

const MainLayout = ({ children, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  return (
    <div className="flex bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
      {sidebarOpen && (
        <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            <nav className="flex flex-col space-y-4">
              <Link
                to="/dashboard"
                className={`hover:bg-gray-700 p-2 rounded text-left ${
                  currentPath === '/dashboard' ? 'bg-gray-700' : ''
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                to="/leads"
                className={`hover:bg-gray-700 p-2 rounded text-left ${
                  currentPath === '/leads' ? 'bg-gray-700' : ''
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                Leads
              </Link>

              <Link
                to="/tasks"  // ✅ use lowercase and plural to match the route in App.js
                className={`hover:bg-gray-700 p-2 rounded text-left ${
                  currentPath === '/tasks' ? 'bg-gray-700' : ''
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                Tasks
              </Link>
            </nav>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <Link
              to="/settings"
              className={`hover:bg-gray-700 p-2 rounded text-left block w-full ${
                currentPath === '/settings' ? 'bg-gray-700' : ''
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              ⚙️ Settings
            </Link>
          </div>
        </aside>
      )}

      <div className="flex-1">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onProfileClick={() => {
            setSidebarOpen(false);
            navigate('/profile');
          }}
          onLogout={onLogout}
        />
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
