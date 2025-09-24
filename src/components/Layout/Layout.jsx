import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SimpleSidebar from '../molecules/Sidebar/SimpleSidebar';
import CartIcon from '../atoms/CartIcon';
import RoleDebug from '../RoleDebug';
import { CartProvider } from '../../context/CartContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <CartProvider>
      <div className="flex h-screen bg-gray-50">
        <SimpleSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <div className="flex-1 overflow-auto">
          <main className="p-4 lg:p-6">
            <Outlet />
          </main>
          <CartIcon />
        </div>
        
        {/* Componente de debug para desarrollo */}
        <RoleDebug />
      </div>
    </CartProvider>
  );
};

export default Layout;
