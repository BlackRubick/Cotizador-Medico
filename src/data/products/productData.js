export const productCategories = [
  {
    id: 'xprezzon',
    name: 'XPREZZON',
    description: 'Monitores de signos vitales',
    image: '/api/placeholder/150/150'
  },
  {
    id: 'cube',
    name: 'CUBE',
    description: 'Sistemas de monitoreo',
    image: '/api/placeholder/150/150'
  },
  {
    id: 'csu',
    name: 'CSU',
    description: 'Unidades de control',
    image: '/api/placeholder/150/150'
  }
];

export const products = {
  xprezzon: [
    {
      id: 'xpz-001',
      name: 'Monitor Cardiaco Estándar IV',
      category: 'xprezzon',
      basePrice: 15500,
      image: '/api/placeholder/80/60',
      code: 'VOO-XPRE-04',
      description: 'Monitor cardiaco con pantalla de 15 pulgadas',
      accessories: ['ECG', 'SpO2', 'NIBP'],
      compatibility: ['ADULTO', 'PEDIÁTRICO', 'NEONATAL']
    },
    {
      id: 'xpz-002',
      name: 'Transductor De Presión',
      category: 'xprezzon',
      basePrice: 8500,
      image: '/api/placeholder/80/60',
      code: 'VOO-XPRE-05',
      description: 'Transductor de presión arterial',
      accessories: ['Cable de conexión', 'Adaptadores'],
      compatibility: ['ADULTO', 'PEDIÁTRICO']
    },
    {
      id: 'xpz-003',
      name: 'Set de Cables Estándar IV',
      category: 'xprezzon',
      basePrice: 3200,
      image: '/api/placeholder/80/60',
      code: 'VOO-XPRE-06',
      description: 'Set completo de cables para monitoreo',
      accessories: ['Cable ECG', 'Cable SpO2', 'Cable NIBP'],
      compatibility: ['ADULTO', 'PEDIÁTRICO', 'NEONATAL']
    }
  ],
  cube: [
    {
      id: 'cube-001',
      name: 'CUBE Monitor Station',
      category: 'cube',
      basePrice: 25000,
      image: '/api/placeholder/80/60',
      code: 'CUBE-MON-01',
      description: 'Estación de monitoreo CUBE con pantalla táctil',
      accessories: ['Pantalla táctil', 'Base giratoria', 'Cables'],
      compatibility: ['HOSPITAL', 'CLÍNICA', 'AMBULANCIA']
    },
    {
      id: 'cube-002',
      name: 'CUBE Sensor Kit',
      category: 'cube',
      basePrice: 12000,
      image: '/api/placeholder/80/60',
      code: 'CUBE-SEN-02',
      description: 'Kit de sensores para sistema CUBE',
      accessories: ['Sensores de temperatura', 'Sensores de presión'],
      compatibility: ['ADULTO', 'PEDIÁTRICO']
    }
  ],
  csu: [
    {
      id: 'csu-001',
      name: 'CSU Control Unit',
      category: 'csu',
      basePrice: 35000,
      image: '/api/placeholder/80/60',
      code: 'CSU-CTRL-01',
      description: 'Unidad de control central CSU',
      accessories: ['Panel de control', 'Cables de red', 'Software'],
      compatibility: ['SISTEMA CENTRAL', 'RED HOSPITALARIA']
    },
    {
      id: 'csu-002',
      name: 'CSU Display Module',
      category: 'csu',
      basePrice: 18000,
      image: '/api/placeholder/80/60',
      code: 'CSU-DISP-02',
      description: 'Módulo de visualización para CSU',
      accessories: ['Pantalla LCD', 'Soporte', 'Cables'],
      compatibility: ['HOSPITAL', 'CLÍNICA']
    }
  ]
};

export const accessories = [
  { id: 'acc-001', name: 'Cable ECG', price: 250 },
  { id: 'acc-002', name: 'Cable SpO2', price: 180 },
  { id: 'acc-003', name: 'Cable NIBP', price: 320 },
  { id: 'acc-004', name: 'Transductor', price: 850 },
  { id: 'acc-005', name: 'Sensor Temperatura', price: 150 },
  { id: 'acc-006', name: 'Base Móvil', price: 500 }
];

export const filters = {
  compatibility: ['ADULTO', 'PEDIÁTRICO', 'NEONATAL', 'HOSPITAL', 'CLÍNICA'],
  priceRange: [
    { label: '$0 - $5,000', min: 0, max: 5000 },
    { label: '$5,000 - $15,000', min: 5000, max: 15000 },
    { label: '$15,000 - $30,000', min: 15000, max: 30000 },
    { label: '$30,000+', min: 30000, max: 999999 }
  ]
};
