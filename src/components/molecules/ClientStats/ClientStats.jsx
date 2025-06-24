import React from 'react';
import { Users, Building, Mail, TrendingUp } from 'lucide-react';
import Card from '../../atoms/Card';

const ClientStats = ({ clients }) => {
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.estado === 'activo').length;
  const clientTypes = [...new Set(clients.map(c => c.tipo))].length;

  const stats = [
    {
      title: 'Total Clientes',
      value: totalClients,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Clientes Activos',
      value: activeClients,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Tipos de Cliente',
      value: clientTypes,
      icon: Building,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'Con Email',
      value: clients.filter(c => c.email).length,
      icon: Mail,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="text-center">
            <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center mx-auto mb-3`}>
              <Icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </Card>
        );
      })}
    </div>
  );
};

export default ClientStats;
