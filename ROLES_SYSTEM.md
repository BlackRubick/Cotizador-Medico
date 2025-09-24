# Sistema de Roles - Cotizador Médico

## Resumen

Este sistema implementa un control de acceso basado en roles para la aplicación Cotizador Médico, permitiendo diferentes niveles de acceso según el tipo de usuario.

## Roles Disponibles

### Administrador (`admin` o `administrador`)
- **Acceso completo** a todas las funcionalidades
- Puede acceder a:
  - Dashboard
  - Nueva Cotización
  - Clientes
  - Historial
  - Perfil
  - Revisar Cotizaciones

### Vendedor (`vendedor`)
- **Acceso limitado** a funcionalidades de ventas
- Puede acceder a:
  - Nueva Cotización
  - Clientes
  - Historial
- **No puede acceder a:**
  - Dashboard
  - Perfil
  - Revisar Cotizaciones

## Estructura del Usuario

El sistema detecta el rol del usuario desde las siguientes propiedades del objeto usuario:
- `user.role`
- `user.tipo_usuario`

Si no se encuentra ninguna de estas propiedades, el sistema asigna automáticamente el rol de `vendedor`.

## Componentes Principales

### `RoleBasedRoute`
Protege rutas específicas basándose en roles permitidos.

```jsx
<RoleBasedRoute allowedRoles={['admin', 'administrador']}>
  <DashboardPage />
</RoleBasedRoute>
```

### `RoleBasedRedirect`
Redirige automáticamente a la página apropiada según el rol del usuario.

### `useUserRole` Hook
Hook personalizado que proporciona utilidades para trabajar con roles:

```jsx
const { isAdmin, isVendedor, hasAccess, getDefaultRoute, getDisplayRole } = useUserRole();
```

### `AccessDenied`
Página de error mostrada cuando un usuario intenta acceder a una ruta no autorizada.

### `RoleDebug` (Solo en desarrollo)
Componente de debug que muestra información del rol actual del usuario.

## Flujo de Navegación

1. **Login**: Usuario se autentica
2. **Detección de Rol**: El sistema detecta automáticamente el rol
3. **Redirección**: 
   - Administradores → `/dashboard`
   - Vendedores → `/cotizar`
4. **Protección de Rutas**: Cada ruta verifica permisos antes de mostrar contenido
5. **Sidebar Dinámico**: Solo muestra opciones disponibles para el rol actual

## Configuración del Backend

Para que el sistema funcione correctamente, el backend debe incluir el campo de rol en la respuesta de autenticación:

```json
{
  "success": true,
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "role": "admin" // o "administrador" o "vendedor"
  },
  "token": "..."
}
```

## Personalización

Para agregar nuevos roles o modificar permisos:

1. **Actualizar el hook `useUserRole`** con la nueva lógica de roles
2. **Modificar el array `allMenuItems`** en `Sidebar.jsx` 
3. **Actualizar las rutas** en `App.jsx` con los nuevos roles permitidos
4. **Agregar casos en `getDefaultRoute()`** para la redirección apropiada

## Ejemplo de Uso

```jsx
// Verificar si un usuario puede acceder a una función específica
const { hasAccess } = useUserRole();

if (hasAccess(['admin', 'administrador'])) {
  // Mostrar funcionalidad de administrador
}
```

## Consideraciones de Seguridad

- ⚠️ **Importante**: La validación de roles en el frontend es solo para UX. 
- 🔒 **Seguridad real**: Todas las rutas del backend deben validar permisos independientemente
- 🛡️ **Tokens**: Los permisos deben estar incluidos en el token JWT o validarse en cada request

## Testing

Para probar diferentes roles durante el desarrollo:

1. El componente `RoleDebug` muestra información del rol actual
2. Modificar temporalmente el objeto usuario en localStorage
3. Usar herramientas de desarrollo para simular diferentes respuestas del backend
