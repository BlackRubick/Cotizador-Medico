import React from 'react';
import { Download } from 'lucide-react';
import Button from '../../atoms/Button';

const ExcelTemplateDownloader = () => {
  const downloadTemplate = () => {
    // Datos de ejemplo para la plantilla con el formato específico del usuario
    const templateData = [
      [
        'CATEGORIA', 'ESPECIALIDAD', 'CLASIFICACION', 'PARA', 'MARCA', 'MODELO', 
        'DESCRIPCIÓN', 'USO', 'UNIDAD', 'PROVEEDOR', 'UOM', 'PRICE EXW', 
        'MONEDA', 'VALOR MONEDA', 'LANDEN FACTOR', 'MARGIN FACTOR', 'COMPATIBILIDAD', 'PRECIO VENTA'
      ],
      [
        'CARDIOLOGIA', 'MONITORES', 'EQUIPO MEDICO', 'ADULTO', 'XPREZZON', 'XPZ-001',
        'Monitor Cardiaco Estándar IV con pantalla de 15 pulgadas', 'HOSPITALARIO', 'UNIDAD', 'PROVEEDOR A', 'PCS',
        '14000', 'USD', '1.0', '1.1', '1.3', 'ADULTO,PEDIATRICO', '15500'
      ],
      [
        'CARDIOLOGIA', 'ACCESORIOS', 'CONSUMIBLE', 'ADULTO', 'XPREZZON', 'XPZ-002',
        'Transductor De Presión Arterial Desechable', 'HOSPITALARIO', 'UNIDAD', 'PROVEEDOR A', 'PCS',
        '7500', 'USD', '1.0', '1.1', '1.15', 'ADULTO,PEDIATRICO', '8500'
      ],
      [
        'CARDIOLOGIA', 'ACCESORIOS', 'CABLE', 'ADULTO', 'XPREZZON', 'XPZ-003',
        'Set de Cables Estándar IV para Monitoreo', 'HOSPITALARIO', 'SET', 'PROVEEDOR A', 'SET',
        '2800', 'USD', '1.0', '1.1', '1.2', 'ADULTO,PEDIATRICO,NEONATAL', '3200'
      ],
      [
        'MONITOREO', 'SISTEMAS', 'EQUIPO MEDICO', 'ADULTO', 'CUBE', 'CUB-001',
        'Sistema de Monitoreo Centralizado CUBE', 'HOSPITALARIO', 'UNIDAD', 'PROVEEDOR B', 'PCS',
        '22000', 'USD', '1.0', '1.1', '1.4', 'ADULTO', '25000'
      ],
      [
        'CONTROL', 'UNIDADES', 'EQUIPO MEDICO', 'ADULTO', 'CSU', 'CSU-001',
        'Unidad de Control Avanzada CSU', 'HOSPITALARIO', 'UNIDAD', 'PROVEEDOR C', 'PCS',
        '16000', 'USD', '1.0', '1.1', '1.35', 'ADULTO', '18000'
      ]
    ];

    // Crear CSV (ya que no podemos generar Excel sin librerías adicionales)
    const csvContent = templateData
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    // Crear archivo para descarga
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Crear enlace de descarga
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plantilla_catalogo_productos.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={downloadTemplate}
      variant="outline"
      size="sm"
      className="flex items-center space-x-2 text-blue-600 border-blue-200 hover:bg-blue-50"
    >
      <Download size={16} />
      <span>Descargar Plantilla</span>
    </Button>
  );
};

export default ExcelTemplateDownloader;
