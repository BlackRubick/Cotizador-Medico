import React, { useState } from 'react';
import Sidebar from '../../molecules/Sidebar';

const DashboardTemplate = ({ children, activeItem = 'perfil', onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigation = (item) => {
    onNavigate(item);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeItem={activeItem}
        onItemClick={handleNavigation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardTemplate;
