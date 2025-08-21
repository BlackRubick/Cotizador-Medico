// src/components/services/equipmentService.js
import { apiRequest } from '../config/api';

class EquipmentService {
  // Obtener todos los equipos de un cliente
  async getClientEquipment(clientId) {
    try {
      const response = await apiRequest(`/clients/${clientId}/equipment`);
      return response;
    } catch (error) {
      console.error('Get client equipment error:', error);
      throw error;
    }
  }

  // Obtener un equipo específico
  async getEquipment(equipmentId) {
    try {
      const response = await apiRequest(`/equipment/${equipmentId}`);
      return response;
    } catch (error) {
      console.error('Get equipment error:', error);
      throw error;
    }
  }

  // Crear un nuevo equipo
  async createEquipment(clientId, equipmentData) {
    try {
      const mappedData = this.mapFrontendToBackend(equipmentData);
      const response = await apiRequest(`/clients/${clientId}/equipment`, {
        method: 'POST',
        body: JSON.stringify(mappedData),
      });
      return response;
    } catch (error) {
      console.error('Create equipment error:', error);
      throw error;
    }
  }

  // Actualizar equipo existente
  async updateEquipment(equipmentId, equipmentData) {
    try {
      const mappedData = this.mapFrontendToBackend(equipmentData);
      const response = await apiRequest(`/equipment/${equipmentId}`, {
        method: 'PUT',
        body: JSON.stringify(mappedData),
      });
      return response;
    } catch (error) {
      console.error('Update equipment error:', error);
      throw error;
    }
  }

  // Eliminar equipo
  async deleteEquipment(equipmentId) {
    try {
      const response = await apiRequest(`/equipment/${equipmentId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.error('Delete equipment error:', error);
      throw error;
    }
  }

  // Obtener categorías de equipos disponibles
  async getEquipmentCategories() {
    try {
      const response = await apiRequest('/equipment/categories');
      return response;
    } catch (error) {
      console.error('Get equipment categories error:', error);
      // Fallback con categorías predefinidas
      return {
        success: true,
        data: this.getDefaultCategories()
      };
    }
  }

  // Obtener marcas de equipos disponibles
  async getEquipmentBrands() {
    try {
      const response = await apiRequest('/equipment/brands');
      return response;
    } catch (error) {
      console.error('Get equipment brands error:', error);
      // Fallback con marcas predefinidas
      return {
        success: true,
        data: this.getDefaultBrands()
      };
    }
  }

  // Mapear datos del frontend al backend
  mapFrontendToBackend(frontendData) {
    return {
      name: frontendData.name,
      model: frontendData.model,
      serialNumber: frontendData.serialNumber,
      category: frontendData.category,
      brand: frontendData.brand,
      location: frontendData.location,
      installDate: frontendData.installDate,
      lastMaintenance: frontendData.lastMaintenance,
      status: frontendData.status || 'active',
      specifications: frontendData.specifications || [],
      notes: frontendData.notes || '',
      purchaseDate: frontendData.purchaseDate,
      warrantyExpiry: frontendData.warrantyExpiry,
      supplier: frontendData.supplier || '',
      cost: frontendData.cost || 0,
      maintenanceInterval: frontendData.maintenanceInterval || 12 // meses
    };
  }

  // Mapear datos del backend al frontend
  mapBackendToFrontend(backendData) {
    return {
      id: backendData.id,
      name: backendData.name,
      model: backendData.model,
      serialNumber: backendData.serialNumber,
      category: backendData.category,
      brand: backendData.brand,
      location: backendData.location,
      installDate: backendData.installDate,
      lastMaintenance: backendData.lastMaintenance,
      status: backendData.status,
      specifications: backendData.specifications || [],
      notes: backendData.notes || '',
      purchaseDate: backendData.purchaseDate,
      warrantyExpiry: backendData.warrantyExpiry,
      supplier: backendData.supplier || '',
      cost: backendData.cost || 0,
      maintenanceInterval: backendData.maintenanceInterval || 12,
      createdAt: backendData.createdAt,
      updatedAt: backendData.updatedAt
    };
  }

  // Categorías por defecto
  getDefaultCategories() {
    return [
      'Monitoreo',
      'Emergencia',
      'Ventilación',
      'Diagnóstico',
      'Laboratorio',
      'Cirugía',
      'Radiología',
      'Rehabilitación',
      'Anestesia',
      'Neonatología',
      'Cardiología',
      'Neurología'
    ];
  }

  // Marcas por defecto
  getDefaultBrands() {
    return [
      'General Electric',
      'Philips',
      'Siemens',
      'Medtronic',
      'Abbott',
      'Johnson & Johnson',
      'Roche',
      'Masimo',
      'Hamilton Medical',
      'Edwards Lifesciences',
      'Mindray',
      'Nihon Kohden',
      'Draeger',
      'Stryker',
      'Olympus'
    ];
  }

  // Validar datos de equipo
  validateEquipmentData(equipmentData) {
    const errors = [];

    if (!equipmentData.name || equipmentData.name.trim() === '') {
      errors.push('Nombre del equipo es requerido');
    }

    if (!equipmentData.model || equipmentData.model.trim() === '') {
      errors.push('Modelo es requerido');
    }

    if (!equipmentData.serialNumber || equipmentData.serialNumber.trim() === '') {
      errors.push('Número de serie es requerido');
    }

    if (!equipmentData.category) {
      errors.push('Categoría es requerida');
    }

    if (!equipmentData.brand || equipmentData.brand.trim() === '') {
      errors.push('Marca es requerida');
    }

    if (!equipmentData.location || equipmentData.location.trim() === '') {
      errors.push('Ubicación es requerida');
    }

    if (equipmentData.installDate && new Date(equipmentData.installDate) > new Date()) {
      errors.push('Fecha de instalación no puede ser futura');
    }

    if (equipmentData.lastMaintenance && new Date(equipmentData.lastMaintenance) > new Date()) {
      errors.push('Fecha de último mantenimiento no puede ser futura');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Calcular próximo mantenimiento
  calculateNextMaintenance(lastMaintenance, intervalMonths = 12) {
    if (!lastMaintenance) return null;
    
    const lastDate = new Date(lastMaintenance);
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + intervalMonths);
    
    return nextDate.toISOString().split('T')[0];
  }

  // Verificar si el equipo necesita mantenimiento
  needsMaintenance(lastMaintenance, intervalMonths = 12, warningDays = 30) {
    if (!lastMaintenance) return { needed: true, overdue: true };
    
    const nextMaintenance = this.calculateNextMaintenance(lastMaintenance, intervalMonths);
    if (!nextMaintenance) return { needed: false, overdue: false };
    
    const today = new Date();
    const nextDate = new Date(nextMaintenance);
    const warningDate = new Date(nextDate);
    warningDate.setDate(warningDate.getDate() - warningDays);
    
    return {
      needed: today >= warningDate,
      overdue: today > nextDate,
      daysUntil: Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24))
    };
  }

  // Obtener estadísticas de equipos para un cliente
  getEquipmentStats(equipments) {
    const total = equipments.length;
    const active = equipments.filter(eq => eq.status === 'active').length;
    const maintenance = equipments.filter(eq => eq.status === 'maintenance').length;
    const outOfService = equipments.filter(eq => eq.status === 'out_of_service').length;
    
    const needsMaintenance = equipments.filter(eq => {
      const maintenance = this.needsMaintenance(eq.lastMaintenance, eq.maintenanceInterval);
      return maintenance.needed;
    }).length;

    const categories = [...new Set(equipments.map(eq => eq.category))].length;
    const brands = [...new Set(equipments.map(eq => eq.brand))].length;

    return {
      total,
      active,
      maintenance,
      outOfService,
      needsMaintenance,
      categories,
      brands,
      utilizationRate: total > 0 ? ((active / total) * 100).toFixed(1) : 0
    };
  }
}

export default new EquipmentService();