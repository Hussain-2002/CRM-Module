import { useState } from 'react';
import Header from './Header';

const MainLayout = ({ children, activePage, onNavigate, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNavigate = (page) => {
    onNavigate(page);
    setSidebarOpen(false); // close sidebar on navigation
  };

  return (
    <div className="flex bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
      {sidebarOpen && (
        <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            <nav className="flex flex-col space-y-4">
              <button
                className={`hover:bg-gray-700 p-2 rounded text-left ${
                  activePage === 'dashboard' ? 'bg-gray-700' : ''
                }`}
                onClick={() => handleNavigate('dashboard')}
              >
                Dashboard
              </button>
              <button
                className={`hover:bg-gray-700 p-2 rounded text-left ${
                  activePage === 'leads' ? 'bg-gray-700' : ''
                }`}
                onClick={() => handleNavigate('leads')}
              >
                Leads
              </button>
            </nav>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <button
              className={`hover:bg-gray-700 p-2 rounded text-left w-full ${
                activePage === 'settings' ? 'bg-gray-700' : ''
              }`}
              onClick={() => handleNavigate('settings')}
            >
              ⚙️ Settings
            </button>
          </div>
        </aside>
      )}

      <div className="flex-1">
        {/* ✅ Pass onProfileClick to Header */}
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onProfileClick={() => handleNavigate('profile')}
          onLogout={onLogout}
        />
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
