import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, User, FileText, History, ShoppingCart, LogOut, Menu, X, Activity, Users, UserPlus } from 'lucide-react';
import { useAuthContext } from '../../../context/AuthContext';
import { useUserRole } from '../../../hooks/useUserRole';

const SimpleSidebar = ({ isOpen = false, onToggle }) => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const { userRole, isAdmin, getDisplayRole, user } = useUserRole();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Crear menú simple basado en el rol
  let menuItems = [];
  
  console.log('SimpleSidebar render - userRole:', userRole);
  
  if (userRole === 'jefe' || userRole === 'admin' || userRole === 'administrador') {
    // Jefe ve todo
    menuItems = [
      { id: 'dashboard', path: '/dashboard', icon: Home, label: 'Dashboard' },
      { id: 'cotizar', path: '/cotizar', icon: ShoppingCart, label: 'Nueva Cotización' },
      { id: 'clientes', path: '/clientes', icon: Users, label: 'Clientes' },
      { id: 'historial', path: '/historial', icon: History, label: 'Historial' },
      { id: 'crear-usuario', path: '/crear-usuario', icon: UserPlus, label: 'Crear Usuario' },
    ];
  } else if (userRole === 'manager' || userRole === 'encargado') {
    // Encargado ve historial, clientes y cotización
    menuItems = [
      { id: 'cotizar', path: '/cotizar', icon: ShoppingCart, label: 'Nueva Cotización' },
      { id: 'clientes', path: '/clientes', icon: Users, label: 'Clientes' },
      { id: 'historial', path: '/historial', icon: History, label: 'Historial' },
    ];
  } else if (userRole === 'user' || userRole === 'vendedor') {
    // Vendedor solo cotización e historial
    menuItems = [
      { id: 'cotizar', path: '/cotizar', icon: ShoppingCart, label: 'Nueva Cotización' },
      { id: 'historial', path: '/historial', icon: History, label: 'Historial' },
    ];
  }
  
  console.log('SimpleSidebar menuItems:', menuItems);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-blue-600 text-white rounded-lg"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-30" onClick={onToggle} />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-40
        lg:block lg:w-72
        ${isOpen ? 'block w-72' : 'hidden w-0'}
      `}>
        <div className="p-6 h-full flex flex-col">
          {/* Logo/Header */}
          <div className="flex items-center space-x-3 mb-8">
            <Activity className="w-8 h-8 text-blue-400" />
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
                  className={({ isActive }) => {
                    console.log(`NavLink ${item.label}:`, { path: item.path, isActive });
                    return `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`;
                  }}
                  onClick={(e) => {
                    console.log(`Clicked on ${item.label}:`, item.path);
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

          {/* User Profile */}
          <div className="mt-auto space-y-4">
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <User size={20} className="text-blue-400" />
                <div>
                  <p className="text-sm font-medium">{user?.nombre || 'Usuario'}</p>
                  <p className="text-xs text-slate-400">{getDisplayRole()}</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white rounded-lg hover:bg-red-500/10"
            >
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SimpleSidebar;
