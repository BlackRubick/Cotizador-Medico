export const mockQuotesForReview = [
  {
    id: 1,
    folio: 'BHL1505164C4',
    fecha: '14/05/2025',
    estado: 'PENDIENTE',
    razonSocial: 'H. CENTRAL DR. IGNACIO MORONES PRIETO',
    direccion: 'AV. NIÑO ARTILLERO 161, HIMNO 78520 SAN LUIS POTOSÍ, S.L.P.',
    encargado: 'FERNANDEZ MARTINEZ',
    puesto: 'JEFE CIRUGIA',
    correo: 'fermar@gmail.com',
    numero: '911',
    hospital: 'HOSPITAL ANGELES',
    direccionHospital: 'CIELO',
    correoHospital: 'APOCALIPS@GMAIL.COM',
    numeroHospital: '11111',
    productos: [
      {
        codigo: 'OVM SER-R1',
        equipo: 'VENTILADOR',
        marca: 'UTAS',
        descripcion: 'Sensor Oxistos SpO2, reutilizable adulto',
        cantidad: 1,
        precioUnitario: 15000
      }
    ],
    condiciones: {
      precios: 'LOS PRECIOS NO INCLUYEN IVA (16%)',
      moneda: 'Pesos Mexicanos',
      condicionesPago: '100% Anticipado a la entrega. (Transferencia Bancaria)',
      tiempoEntrega: 'Tiempo de Entrega',
      garantia: 'Garantía: Solo sobre defectos de fabricación. No aplica garantía en partes colocadas por personal que no esté certificado por nosotros.\nGarantía 12 meses.\nUNA VEZ CONFIRMADO EL PEDIDO, NO SE ACEPTAN CANCELACIONES Y/O DEVOLUCIONES.',
      observaciones: 'Sin más por el momento, nos ponemos a sus órdenes para cualquier duda y/o información adicional.'
    },
    total: 17400 // 15000 + IVA
  },
  {
    id: 2,
    folio: 'BHL2506174D5',
    fecha: '25/06/2025',
    estado: 'confirmado',
    razonSocial: 'CLÍNICA ESPECIALIZADA DEL SURESTE',
    direccion: 'CALLE 5 DE MAYO 456, TUXTLA GUTIÉRREZ, CHIAPAS',
    encargado: 'DRA. PATRICIA MORALES',
    puesto: 'JEFE MÉDICO',
    correo: 'pmorales@clinicasur.com',
    numero: '+52 961 345 6789',
    hospital: 'CLÍNICA SURESTE',
    direccionHospital: 'CENTRO',
    correoHospital: 'INFO@CLINICASUR.COM',
    numeroHospital: '22222',
    productos: [
      {
        codigo: 'ECG-LEAD-5',
        equipo: 'MONITOR CARDIACO',
        marca: 'PHILIPS',
        descripcion: 'Cable ECG 5 derivaciones, adulto',
        cantidad: 2,
        precioUnitario: 8500
      },
      {
        codigo: 'SPO2-SENS-A',
        equipo: 'OXÍMETRO',
        marca: 'MASIMO',
        descripcion: 'Sensor SpO2 adulto, reutilizable',
        cantidad: 3,
        precioUnitario: 4200
      }
    ],
    condiciones: {
      precios: 'LOS PRECIOS NO INCLUYEN IVA (16%)',
      moneda: 'Pesos Mexicanos',
      condicionesPago: '50% Anticipado, 50% contra entrega',
      tiempoEntrega: '15 días hábiles',
      garantia: 'Garantía: 12 meses sobre defectos de fabricación.\nNo aplica garantía en partes colocadas por personal no certificado.\nUNA VEZ CONFIRMADO EL PEDIDO, NO SE ACEPTAN CANCELACIONES.',
      observaciones: 'Precios válidos por 30 días. Instalación incluida.'
    },
    total: 35712 // (8500*2 + 4200*3) * 1.16
  },
  {
    id: 3,
    folio: 'BHL1507185E6',
    fecha: '15/07/2025',
    estado: 'revisión',
    razonSocial: 'HOSPITAL REGIONAL DE ALTA ESPECIALIDAD',
    direccion: 'BLVD. BELISARIO DOMÍNGUEZ 789, TUXTLA GUTIÉRREZ',
    encargado: 'DR. CARLOS EDUARDO RUIZ',
    puesto: 'DIRECTOR MÉDICO',
    correo: 'cruiz@hospitalregional.gob.mx',
    numero: '+52 961 456 7890',
    hospital: 'HOSPITAL REGIONAL',
    direccionHospital: 'ZONA CENTRO',
    correoHospital: 'CONTACTO@HOSPITALREGIONAL.GOB.MX',
    numeroHospital: '33333',
    productos: [
      {
        codigo: 'VENT-TUBE-7',
        equipo: 'VENTILADOR',
        marca: 'MEDTRONIC',
        descripcion: 'Tubo endotraqueal 7.0mm, desechable',
        cantidad: 10,
        precioUnitario: 850
      },
      {
        codigo: 'PRESS-TRANS',
        equipo: 'MONITOR',
        marca: 'EDWARDS',
        descripcion: 'Transductor de presión arterial',
        cantidad: 5,
        precioUnitario: 12000
      }
    ],
    condiciones: {
      precios: 'LOS PRECIOS NO INCLUYEN IVA (16%)',
      moneda: 'Pesos Mexicanos',
      condicionesPago: '30 días crédito posterior a entrega',
      tiempoEntrega: '20 días hábiles',
      garantia: 'Garantía: 24 meses sobre defectos de fabricación.\nCapacitación incluida para personal médico.\nSoporte técnico 24/7 durante el primer año.',
      observaciones: 'Cotización para licitación pública. Cumplimiento con especificaciones técnicas requeridas.'
    },
    total: 89080 // (850*10 + 12000*5) * 1.16
  },
  {
    id: 4,
    folio: 'BHL0808196F7',
    fecha: '08/08/2025',
    estado: 'enviado',
    razonSocial: 'CENTRO MÉDICO PEDIÁTRICO',
    direccion: 'AV. INSURGENTES 234, TUXTLA GUTIÉRREZ, CHIAPAS',
    encargado: 'DRA. LUCIA FERNÁNDEZ',
    puesto: 'JEFE PEDIATRÍA',
    correo: 'lfernandez@pediatrico.com',
    numero: '+52 961 567 8901',
    hospital: 'CENTRO PEDIÁTRICO',
    direccionHospital: 'COLONIA MÉDICA',
    correoHospital: 'INFO@PEDIATRICO.COM',
    numeroHospital: '44444',
    productos: [
      {
        codigo: 'PED-CUFF-S',
        equipo: 'BAUMANÓMETRO',
        marca: 'OMRON',
        descripcion: 'Brazalete pediátrico pequeño',
        cantidad: 6,
        precioUnitario: 2800
      },
      {
        codigo: 'PED-STET-NEO',
        equipo: 'ESTETOSCOPIO',
        marca: 'LITTMANN',
        descripcion: 'Estetoscopio neonatal especial',
        cantidad: 4,
        precioUnitario: 5600
      }
    ],
    condiciones: {
      precios: 'LOS PRECIOS NO INCLUYEN IVA (16%)',
      moneda: 'Pesos Mexicanos',
      condicionesPago: '100% Anticipado mediante transferencia',
      tiempoEntrega: '10 días hábiles',
      garantia: 'Garantía: 18 meses sobre defectos de fabricación.\nEquipo especializado para uso pediátrico.\nCertificación FDA incluida.',
      observaciones: 'Equipo especializado para atención pediátrica y neonatal. Calibración incluida.'
    },
    total: 45872 // (2800*6 + 5600*4) * 1.16
  },
  {
    id: 5,
    folio: 'BHL2009207G8',
    fecha: '20/09/2025',
    estado: 'cancelado',
    razonSocial: 'LABORATORIO DE ANÁLISIS CLÍNICOS',
    direccion: 'CALLE 12 DE OCTUBRE 567, TUXTLA GUTIÉRREZ',
    encargado: 'Q.F.B. ROBERTO MÉNDEZ',
    puesto: 'JEFE LABORATORIO',
    correo: 'rmendez@labclinico.com',
    numero: '+52 961 678 9012',
    hospital: 'LAB CLÍNICO',
    direccionHospital: 'ZONA NORTE',
    correoHospital: 'CONTACTO@LABCLINICO.COM',
    numeroHospital: '55555',
    productos: [
      {
        codigo: 'MICRO-TIPS-200',
        equipo: 'MICROPIPETA',
        marca: 'EPPENDORF',
        descripcion: 'Puntas para micropipeta 200μL',
        cantidad: 20,
        precioUnitario: 450
      },
      {
        codigo: 'CENT-TUBE-15',
        equipo: 'CENTRÍFUGA',
        marca: 'HERMLE',
        descripcion: 'Tubos para centrífuga 15mL',
        cantidad: 50,
        precioUnitario: 85
      }
    ],
    condiciones: {
      precios: 'LOS PRECIOS NO INCLUYEN IVA (16%)',
      moneda: 'Pesos Mexicanos',
      condicionesPago: '15 días crédito',
      tiempoEntrega: '7 días hábiles',
      garantia: 'Garantía: Productos desechables, no aplica garantía.\nCertificado de calidad incluido.\nMaterial estéril y certificado.',
      observaciones: 'Material de laboratorio de alta precisión. Embalaje especial para conservación.'
    },
    total: 15776 // (450*20 + 85*50) * 1.16
  }
];
