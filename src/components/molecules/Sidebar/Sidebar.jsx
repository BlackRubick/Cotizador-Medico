import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, User, FileText, History, ShoppingCart, LogOut, Menu, X, Activity, Users, Calendar } from 'lucide-react';
import { useAuthContext } from '../../../context/AuthContext';

const Sidebar = ({ isOpen = false, onToggle }) => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', path: '/dashboard', icon: Home, label: 'Dashboard', color: 'from-blue-500 to-blue-600' },
    { id: 'cotizar', path: '/cotizar', icon: ShoppingCart, label: 'Nueva Cotización', color: 'from-green-500 to-green-600' },
    { id: 'clientes', path: '/clientes', icon: Users, label: 'Clientes', color: 'from-purple-500 to-purple-600' },
    { id: 'historial', path: '/historial', icon: History, label: 'Historial', color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110 backdrop-blur-lg"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-30 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-500 z-40 shadow-2xl
        lg:block lg:w-72
        ${isOpen ? 'block w-72 animate-in slide-in-from-left duration-500' : 'hidden w-0 animate-out slide-out-to-left duration-300'}
      `}>
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
        
        <div className="relative p-8 h-full flex flex-col">
          {/* Logo/Header */}
          <div className="flex items-center space-x-4 mb-12 relative">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl shadow-xl">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Cotizador
              </h1>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-3 flex-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                  onClick={() => {
                    // Cerrar sidebar en mobile después de hacer click
                    if (window.innerWidth < 1024 && isOpen) {
                      onToggle();
                    }
                  }}
                >
                  {({ isActive }) => (
                    <div className={`group relative w-full flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl shadow-blue-600/25' 
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}>
                      {/* Icon background with gradient */}
                      <div className={`relative p-2 rounded-xl transition-all duration-300 group-hover:scale-110 ${
                        isActive
                          ? 'bg-white/20 shadow-lg'
                          : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                        <Icon size={20} className="relative z-10" />
                        {/* Animated background */}
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                      </div>
                      
                      <div className="flex-1">
                        <span className="font-medium text-sm tracking-wide">{item.label}</span>
                      </div>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="w-1 h-8 bg-gradient-to-b from-white to-blue-200 rounded-full shadow-lg animate-pulse"></div>
                      )}
                      
                      {/* Hover effect line */}
                      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></div>
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className="mt-auto space-y-4">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 p-2 rounded-xl">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Usuario</p>
                  <p className="text-xs text-slate-400">Administrador</p>
                </div>
              </div>
            </div>
            
            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="group w-full flex items-center space-x-4 px-4 py-4 text-slate-300 hover:text-white rounded-2xl transition-all duration-300 transform hover:scale-105 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
            >
              <div className="relative p-2 rounded-xl bg-white/5 group-hover:bg-red-500/20 transition-all duration-300 group-hover:scale-110">
                <LogOut size={20} className="relative z-10" />
              </div>
              <span className="font-medium text-sm tracking-wide">Cerrar Sesión</span>
              
              {/* Animated arrow on hover */}
              <div className="ml-auto opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <div className="w-2 h-2 border-t-2 border-r-2 border-current rotate-45"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
