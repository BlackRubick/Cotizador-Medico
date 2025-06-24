export const mockProfile = {
  nombre: 'Juan Carlos',
  apellidos: 'González López',
  correo: 'juan.gonzalez@empresa.com',
  numero: '+52 961 123 4567',
  puesto: 'Administrador'
};

export const mockQuotes = [
  {
    id: 1,
    razonSocial: 'Empresa ABC S.A.',
    fecha: '2024-01-15',
    precio: '15,000',
    estado: 'confirmado',
    cliente: 'María Rodríguez',
    descripcion: 'Cotización para equipo médico especializado'
  },
  {
    id: 2,
    razonSocial: 'Clínica San José',
    fecha: '2024-01-10',
    precio: '25,500',
    estado: 'pendiente',
    cliente: 'Dr. Roberto Méndez',
    descripción: 'Sistema de radiología digital'
  },
  {
    id: 3,
    razonSocial: 'Hospital Central',
    fecha: '2024-01-08',
    precio: '45,000',
    estado: 'cancelado',
    cliente: 'Lic. Ana Torres',
    descripcion: 'Equipo de ultrasonido 4D'
  },
  {
    id: 4,
    razonSocial: 'Laboratorio Med+',
    fecha: '2024-01-05',
    precio: '12,300',
    estado: 'confirmado',
    cliente: 'Q.F.B. Carlos Ruiz',
    descripcion: 'Analizador bioquímico automático'
  },
  {
    id: 5,
    razonSocial: 'Centro Médico Norte',
    fecha: '2023-12-28',
    precio: '18,750',
    estado: 'pendiente',
    cliente: 'Dra. Lucia Fernández',
    descripcion: 'Monitor de signos vitales'
  }
];

export const mockClients = [
  {
    id: 1,
    nombre: 'Hospital General',
    contacto: 'Dr. Eduardo Ramírez',
    telefono: '+52 961 234 5678',
    email: 'contacto@hospitalgeneral.com',
    direccion: 'Av. Central 123, Tuxtla Gutiérrez'
  },
  {
    id: 2,
    nombre: 'Clínica Especializada',
    contacto: 'Lic. Patricia Morales',
    telefono: '+52 961 345 6789',
    email: 'info@clinicaesp.com',
    direccion: 'Calle 5 de Mayo 456, Tuxtla Gutiérrez'
  }
];

export const mockClientsExtended = [
  {
    id: 1,
    nombre: 'Hospital General de Tuxtla',
    contacto: 'Dr. Eduardo Ramírez',
    telefono: '+52 961 234 5678',
    email: 'contacto@hospitalgeneral.com',
    direccion: 'Av. Central 123, Tuxtla Gutiérrez, Chiapas',
    rfc: 'HGT850101ABC',
    tipo: 'Hospital',
    estado: 'activo',
    fechaRegistro: '2024-01-15'
  },
  {
    id: 2,
    nombre: 'Clínica Especializada del Sur',
    contacto: 'Lic. Patricia Morales',
    telefono: '+52 961 345 6789',
    email: 'info@clinicasur.com',
    direccion: 'Calle 5 de Mayo 456, Tuxtla Gutiérrez, Chiapas',
    rfc: 'CES900215XYZ',
    tipo: 'Clínica',
    estado: 'activo',
    fechaRegistro: '2024-01-10'
  },
  {
    id: 3,
    nombre: 'Laboratorio Médico Central',
    contacto: 'Q.F.B. Carlos Ruiz',
    telefono: '+52 961 456 7890',
    email: 'laboratorio@medcentral.com',
    direccion: 'Blvd. Belisario Domínguez 789, Tuxtla Gutiérrez',
    rfc: 'LMC751020DEF',
    tipo: 'Laboratorio',
    estado: 'activo',
    fechaRegistro: '2024-01-08'
  },
  {
    id: 4,
    nombre: 'Centro de Diagnóstico Avanzado',
    contacto: 'Dra. Ana Torres',
    telefono: '+52 961 567 8901',
    email: 'info@diagnosticoavanzado.com',
    direccion: 'Av. Insurgentes 234, Tuxtla Gutiérrez',
    rfc: 'CDA820305GHI',
    tipo: 'Centro Diagnóstico',
    estado: 'activo',
    fechaRegistro: '2024-01-05'
  },
  {
    id: 5,
    nombre: 'Consultorios Médicos del Norte',
    contacto: 'Dr. Roberto Méndez',
    telefono: '+52 961 678 9012',
    email: 'consultorios@mednorte.com',
    direccion: 'Calle 12 de Octubre 567, Tuxtla Gutiérrez',
    rfc: 'CMN770825JKL',
    tipo: 'Consultorio',
    estado: 'inactivo',
    fechaRegistro: '2023-12-20'
  }
];
