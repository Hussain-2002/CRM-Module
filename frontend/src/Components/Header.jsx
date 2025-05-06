// src/components/Header.jsx
import { Menu, Bell, User } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-[#174E63] text-white flex justify-between items-center px-6 py-4 shadow-md">
      {/* Left side - Hamburger + Logo */}
      <div className="flex items-center space-x-4">
        {/* Hamburger Button */}
        <button onClick={onMenuClick} className="p-2 rounded hover:bg-[#145263]">
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <img src="/logo.png" alt="Logo" className="h-10 w-25" />
      </div>

      {/* Right side - Company Name, Bell, User */}
      <div className="flex items-center space-x-6">
        <span className="text-lg font-semibold">Goanny Technology</span>

        <Bell className="w-6 h-6 cursor-pointer" />
        
        <button className="flex items-center space-x-2">
          <User className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
