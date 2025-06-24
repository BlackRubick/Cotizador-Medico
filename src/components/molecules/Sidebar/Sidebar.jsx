import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, User, FileText, History, ShoppingCart, LogOut, Menu } from 'lucide-react';
import { useAuthContext } from '../../../context/AuthContext';

const Sidebar = ({ isOpen = false, onToggle }) => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', path: '/dashboard', icon: Home, label: 'Dashboard' },
    { id: 'perfil', path: '/perfil', icon: User, label: 'Perfil' },
    { id: 'cotizar', path: '/cotizar', icon: ShoppingCart, label: 'Cotizar' },
    { id: 'clientes', path: '/clientes', icon: FileText, label: 'Clientes' },
    { id: 'historial', path: '/historial', icon: History, label: 'Historial de cotizaciones' },
    { id: 'revisar', path: '/revisar-cotizaciones', icon: FileText, label: 'Revisar Cotizaciones' },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative left-0 top-0 h-full bg-blue-600 text-white transition-all duration-300 z-40
        lg:block lg:w-64
        ${isOpen ? 'block w-64' : 'hidden w-0'}
      `}>
        <div className="p-6 h-full flex flex-col">
          {/* Logo/Header */}
          <div className="flex items-center space-x-3 mb-8">
            <Home className="w-8 h-8" />
            <h1 className="text-xl font-bold">Cotizador</h1>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-700 text-white' 
                        : 'text-blue-100 hover:bg-blue-500'
                    }`
                  }
                  onClick={() => {
                    // Cerrar sidebar en mobile después de hacer click
                    if (window.innerWidth < 1024 && isOpen) {
                      onToggle();
                    }
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="mt-auto">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-blue-100 hover:bg-blue-500 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
