import * as XLSX from 'xlsx';

// Column headers
const HEADERS = [
  'ID del caso de prueba',
  'Módulo/Sección',
  'Elemento a probar',
  'Descripción de la prueba',
  'Pasos para ejecutar',
  'Resultado esperado',
  'Resultado obtenido',
  'Estado (Pass/Fail)',
  'Prioridad (Alta/Media/Baja)',
  'Comentarios'
];

// Helper to join steps
const steps = (arr) => arr.map((s,i)=>`${i+1}. ${s}`).join('\n');

// Test cases definition
const cases = [
  // Autenticación - Login
  {id:'TC-LOGIN-001', mod:'Autenticación', el:'Campo Email', desc:'Validar ingreso de email válido', steps:steps(['Abrir /login','Ingresar email válido','Ingresar contraseña válida','Click en Iniciar Sesión']), exp:'Usuario autenticado y redirigido según rol', prio:'Alta'},
  {id:'TC-LOGIN-002', mod:'Autenticación', el:'Campo Email', desc:'Rechazo de email vacío', steps:steps(['Abrir /login','Dejar email vacío','Ingresar contraseña válida','Click en Iniciar Sesión']), exp:'Mensaje de validación: Email requerido', prio:'Alta'},
  {id:'TC-LOGIN-003', mod:'Autenticación', el:'Campo Email', desc:'Validación formato inválido', steps:steps(['Abrir /login','Ingresar "usuario@"','Ingresar contraseña válida','Click en Iniciar Sesión']), exp:'Mensaje: Formato de email inválido', prio:'Alta'},
  {id:'TC-LOGIN-004', mod:'Autenticación', el:'Campo Password', desc:'Rechazo de contraseña vacía', steps:steps(['Abrir /login','Ingresar email válido','Dejar contraseña vacía','Click en Iniciar Sesión']), exp:'Mensaje: Contraseña requerida', prio:'Alta'},
  {id:'TC-LOGIN-005', mod:'Autenticación', el:'Login Button', desc:'Botón deshabilitado con campos vacíos (si aplica)', steps:steps(['Abrir /login','No ingresar datos','Verificar estado del botón']), exp:'Botón deshabilitado o validaciones visibles', prio:'Media'},
  {id:'TC-LOGIN-006', mod:'Autenticación', el:'Login Button', desc:'Credenciales inválidas', steps:steps(['Abrir /login','Ingresar email válido','Ingresar contraseña incorrecta','Click Iniciar Sesión']), exp:'Mensaje de error de autenticación', prio:'Alta'},
  {id:'TC-LOGIN-007', mod:'Autenticación', el:'Recordar sesión (si existe)', desc:'Persistencia de sesión', steps:steps(['Marcar checkbox Recordar','Iniciar sesión','Refrescar página']), exp:'Sesión permanece activa', prio:'Media'},
  {id:'TC-LOGIN-008', mod:'Autenticación', el:'Redirección post-login', desc:'Redirigir según rol', steps:steps(['Iniciar sesión con rol Admin']), exp:'Dashboard /dashboard visible', prio:'Alta'},
  {id:'TC-LOGIN-009', mod:'Autenticación', el:'Protección ruta privada', desc:'Acceso sin autenticación', steps:steps(['Ir a /dashboard sin iniciar sesión']), exp:'Redirige a /login', prio:'Alta'},
  {id:'TC-LOGIN-010', mod:'Autenticación', el:'Logout', desc:'Cerrar sesión desde menú', steps:steps(['Iniciar sesión','Click en logout']), exp:'Redirige a /login y limpia sesión', prio:'Alta'},

  // Forgot Password
  {id:'TC-FP-001', mod:'Recuperar contraseña', el:'Campo Email', desc:'Enviar email válido', steps:steps(['Abrir /forgot-password','Ingresar email válido registrado','Click Enviar']), exp:'Mensaje confirmación de envío', prio:'Alta'},
  {id:'TC-FP-002', mod:'Recuperar contraseña', el:'Campo Email', desc:'Email no registrado', steps:steps(['Abrir /forgot-password','Ingresar email no registrado','Click Enviar']), exp:'Mensaje: Email no encontrado (o genérico)', prio:'Media'},
  {id:'TC-FP-003', mod:'Recuperar contraseña', el:'Campo Email', desc:'Validación formato incorrecto', steps:steps(['Abrir /forgot-password','Ingresar texto sin @','Click Enviar']), exp:'Mensaje: Formato inválido', prio:'Alta'},
  {id:'TC-FP-004', mod:'Recuperar contraseña', el:'Botón Enviar', desc:'Estado deshabilitado con campo vacío', steps:steps(['Abrir /forgot-password','No ingresar nada','Verificar botón']), exp:'Botón deshabilitado o validación mostrada', prio:'Media'},

  // Layout / Navegación
  {id:'TC-NAV-001', mod:'Layout', el:'Sidebar/Menu', desc:'Visualización de elementos de menú', steps:steps(['Iniciar sesión','Observar menú lateral']), exp:'Ítems esperados visibles (Dashboard, Cotizar, Historial, Clientes)', prio:'Alta'},
  {id:'TC-NAV-002', mod:'Layout', el:'Navegación Dashboard', desc:'Click en Dashboard', steps:steps(['Click Dashboard']), exp:'Contenido Dashboard se muestra', prio:'Alta'},
  {id:'TC-NAV-003', mod:'Layout', el:'Navegación Cotizar', desc:'Click en Cotizar', steps:steps(['Click Cotizar']), exp:'Formulario de cotización visible', prio:'Alta'},
  {id:'TC-NAV-004', mod:'Layout', el:'Navegación Historial', desc:'Click en Historial', steps:steps(['Click Historial']), exp:'Listado de cotizaciones previas', prio:'Media'},
  {id:'TC-NAV-005', mod:'Layout', el:'Navegación Clientes', desc:'Click en Clientes', steps:steps(['Click Clientes']), exp:'Listado / gestión de clientes', prio:'Media'},
  {id:'TC-NAV-006', mod:'Layout', el:'Logo/Home', desc:'Click en logo redirige inicio', steps:steps(['Desde otra sección click logo']), exp:'Redirige a página principal/redirect rol', prio:'Baja'},
  {id:'TC-NAV-007', mod:'Layout', el:'Ruta desconocida', desc:'Manejo de 404', steps:steps(['Ir a /ruta-inexistente']), exp:'Redirección controlada (RoleBasedRedirect)', prio:'Media'},

  // Role Based Redirect / Access
  {id:'TC-ROLE-001', mod:'Roles', el:'RoleBasedRedirect', desc:'Redirección rol Admin', steps:steps(['Login como Admin']), exp:'Accede a dashboard', prio:'Alta'},
  {id:'TC-ROLE-002', mod:'Roles', el:'RoleBasedRedirect', desc:'Redirección rol Operador', steps:steps(['Login como Operador']), exp:'Accede a cotización', prio:'Alta'},
  {id:'TC-ROLE-003', mod:'Roles', el:'ProtectedRoute', desc:'Bloqueo sin token', steps:steps(['Borrar storage','Ir /dashboard']), exp:'Redirige a /login', prio:'Alta'},

  // Cotizar - Formulario principal
  {id:'TC-COT-001', mod:'Cotización', el:'Formulario Datos Cliente', desc:'Campos obligatorios requeridos', steps:steps(['Ir a Cotizar','Dejar campos obligatorios vacíos','Intentar avanzar / generar']), exp:'Mensajes de validación por campo', prio:'Alta'},
  {id:'TC-COT-002', mod:'Cotización', el:'Campo Nombre Cliente', desc:'Longitud mínima', steps:steps(['Ingresar 1 carácter','Intentar guardar']), exp:'Mensaje: Longitud mínima no cumplida', prio:'Media'},
  {id:'TC-COT-003', mod:'Cotización', el:'Campo Email Cliente', desc:'Formato inválido', steps:steps(['Ingresar nombre@','Guardar']), exp:'Mensaje formato inválido', prio:'Alta'},
  {id:'TC-COT-004', mod:'Cotización', el:'Selección Producto', desc:'Seleccionar producto válido', steps:steps(['Abrir selector productos','Elegir uno']), exp:'Producto aparece en lista de items', prio:'Alta'},
  {id:'TC-COT-005', mod:'Cotización', el:'Agregar Múltiples Productos', desc:'Sumatoria correcta', steps:steps(['Agregar 3 productos distintos']), exp:'Total actualiza correctamente', prio:'Alta'},
  {id:'TC-COT-006', mod:'Cotización', el:'Eliminar Producto', desc:'Eliminar línea de producto', steps:steps(['Agregar producto','Eliminar producto']), exp:'Producto desaparece y total recalcula', prio:'Alta'},
  {id:'TC-COT-007', mod:'Cotización', el:'Cantidades', desc:'Validar no aceptar 0 o negativos', steps:steps(['Agregar producto','Editar cantidad a 0']), exp:'Mensaje de validación y no aplica 0', prio:'Alta'},
  {id:'TC-COT-008', mod:'Cotización', el:'Descuentos', desc:'Aplicar descuento válido', steps:steps(['Agregar productos','Aplicar descuento permitido']), exp:'Total refleja descuento', prio:'Media'},
  {id:'TC-COT-009', mod:'Cotización', el:'Descuentos', desc:'Rechazar descuento fuera de rango', steps:steps(['Aplicar descuento > máximo']), exp:'Mensaje de error y no aplica', prio:'Media'},
  {id:'TC-COT-010', mod:'Cotización', el:'Impuestos', desc:'Cálculo de impuestos', steps:steps(['Agregar productos','Ver total con impuestos']), exp:'Total incluye impuestos correctos', prio:'Alta'},
  {id:'TC-COT-011', mod:'Cotización', el:'Guardar Borrador', desc:'Guardar sin finalizar', steps:steps(['Completar datos mínimos','Click Guardar']), exp:'Borrador visible en historial/estado borrador', prio:'Media'},
  {id:'TC-COT-012', mod:'Cotización', el:'Generar PDF', desc:'Descarga de PDF exitosa', steps:steps(['Completar cotización','Click Generar PDF']), exp:'Archivo PDF descargado con datos correctos', prio:'Alta'},
  {id:'TC-COT-013', mod:'Cotización', el:'Enviar por Email', desc:'Envío email exitoso', steps:steps(['Completar cotización','Click Enviar Email']), exp:'Mensaje de éxito y email recibido (si testable)', prio:'Alta'},
  {id:'TC-COT-014', mod:'Cotización', el:'Timeout/Loading', desc:'Indicador de carga', steps:steps(['Acción que llama API','Observar UI']), exp:'Spinner / indicador visible, no bloquea', prio:'Baja'},
  {id:'TC-COT-015', mod:'Cotización', el:'Validación Campos Numéricos', desc:'Rechaza letras en cantidad', steps:steps(['Intentar ingresar letras en cantidad']), exp:'No permite letras / mensaje error', prio:'Alta'},

  // Historial
  {id:'TC-HIST-001', mod:'Historial', el:'Listado', desc:'Mostrar cotizaciones existentes', steps:steps(['Ir a Historial']), exp:'Tabla con registros', prio:'Media'},
  {id:'TC-HIST-002', mod:'Historial', el:'Filtro por Cliente', desc:'Filtrar resultados', steps:steps(['Ingresar nombre cliente en filtro']), exp:'Lista se reduce correctamente', prio:'Media'},
  {id:'TC-HIST-003', mod:'Historial', el:'Ordenar por Fecha', desc:'Orden asc/desc', steps:steps(['Click encabezado Fecha']), exp:'Orden cambia correctamente', prio:'Baja'},
  {id:'TC-HIST-004', mod:'Historial', el:'Ver Detalle', desc:'Abrir detalle cotización', steps:steps(['Click en registro']), exp:'Detalle mostrado (modal/página)', prio:'Media'},
  {id:'TC-HIST-005', mod:'Historial', el:'Paginación', desc:'Cambiar página', steps:steps(['Click página 2']), exp:'Se muestran registros de página 2', prio:'Baja'},

  // Clientes
  {id:'TC-CLI-001', mod:'Clientes', el:'Listado', desc:'Mostrar lista clientes', steps:steps(['Ir a Clientes']), exp:'Tabla clientes visible', prio:'Media'},
  {id:'TC-CLI-002', mod:'Clientes', el:'Crear Cliente', desc:'Alta con datos válidos', steps:steps(['Click Nuevo','Completar formulario','Guardar']), exp:'Cliente aparece en listado', prio:'Alta'},
  {id:'TC-CLI-003', mod:'Clientes', el:'Validaciones Form Cliente', desc:'Campos obligatorios', steps:steps(['Dejar campos requeridos vacíos','Guardar']), exp:'Mensajes de validación', prio:'Alta'},
  {id:'TC-CLI-004', mod:'Clientes', el:'Editar Cliente', desc:'Modificar datos', steps:steps(['Seleccionar cliente','Editar','Guardar']), exp:'Cambios reflejados', prio:'Media'},
  {id:'TC-CLI-005', mod:'Clientes', el:'Eliminar Cliente', desc:'Confirmación y borrado', steps:steps(['Seleccionar cliente','Eliminar','Confirmar']), exp:'Cliente eliminado de la lista', prio:'Alta'},
  {id:'TC-CLI-006', mod:'Clientes', el:'Búsqueda', desc:'Filtrar por texto', steps:steps(['Ingresar término en buscar']), exp:'Lista filtrada', prio:'Media'},

  // Modales / Popups
  {id:'TC-MOD-001', mod:'UI', el:'Modal Confirmación', desc:'Confirmar acción destructiva', steps:steps(['Eliminar cliente','Modal aparece','Click Confirmar']), exp:'Acción se ejecuta y modal cierra', prio:'Media'},
  {id:'TC-MOD-002', mod:'UI', el:'Modal Cancelar', desc:'Cancelar acción', steps:steps(['Eliminar cliente','Modal aparece','Click Cancelar']), exp:'No se ejecuta acción y modal cierra', prio:'Media'},
  {id:'TC-MOD-003', mod:'UI', el:'Cierre por ESC', desc:'Cerrar modal con tecla ESC', steps:steps(['Abrir modal','Presionar ESC']), exp:'Modal se cierra', prio:'Baja'},
  {id:'TC-MOD-004', mod:'UI', el:'Click fuera', desc:'Cerrar modal haciendo click fuera', steps:steps(['Abrir modal','Click overlay']), exp:'Modal se cierra', prio:'Baja'},

  // Performance / Resiliencia básica
  {id:'TC-PERF-001', mod:'Performance', el:'Carga Inicial', desc:'Tiempo de carga aceptable', steps:steps(['Abrir app primera vez']), exp:'Carga < 3s (referencia) en entorno controlado', prio:'Baja'},
  {id:'TC-PERF-002', mod:'Performance', el:'Operaciones Repetidas', desc:'Agregar repetidamente productos', steps:steps(['Agregar 20 productos secuencialmente']), exp:'Sin degradación severa ni bloqueos', prio:'Baja'},

  // Seguridad básica (front)
  {id:'TC-SEC-001', mod:'Seguridad', el:'No exponer datos sensibles', desc:'Revisar Network / Storage', steps:steps(['Iniciar sesión','Inspeccionar LocalStorage/SessionStorage']), exp:'No hay contraseñas en texto plano', prio:'Alta'},
  {id:'TC-SEC-002', mod:'Seguridad', el:'Prevención navegación atrás tras logout', desc:'Historial navegador', steps:steps(['Login','Logout','Click botón atrás navegador']), exp:'No accede a rutas protegidas', prio:'Media'},

  // Errores / API fallos (simulados si posible)
  {id:'TC-ERR-001', mod:'Errores', el:'Fallo carga productos', desc:'Mostrar mensaje error', steps:steps(['Simular fallo API productos']), exp:'Mensaje user-friendly y opción reintentar', prio:'Alta'},
  {id:'TC-ERR-002', mod:'Errores', el:'Fallo envío email', desc:'Error controlado', steps:steps(['Forzar error email (desconectar red)','Enviar email']), exp:'Mensaje de error y no bloqueo UI', prio:'Alta'},
  {id:'TC-ERR-003', mod:'Errores', el:'Fallo guardado cotización', desc:'Manejo error backend', steps:steps(['Simular error al guardar']), exp:'Mensaje y permite reintentar', prio:'Alta'},
];

// Convert to worksheet rows
const rows = [HEADERS];
cases.forEach(tc => {
  rows.push([
    tc.id,
    tc.mod,
    tc.el,
    tc.desc,
    tc.steps,
    tc.exp,
    '', // Resultado obtenido
    '', // Estado
    tc.prio,
    ''  // Comentarios
  ]);
});

// Create worksheet
const ws = XLSX.utils.aoa_to_sheet(rows);

// Basic header styling (note: community XLSX has limited styling support; some viewers may ignore)
HEADERS.forEach((h, idx) => {
  const cellRef = XLSX.utils.encode_cell({ r:0, c:idx });
  if (!ws[cellRef]) return;
  ws[cellRef].s = {
    font: { bold: true, color: { rgb: 'FFFFFFFF' } },
    fill: { fgColor: { rgb: '4F46E5' } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: {
      top: { style: 'thin', color: { rgb: 'FFFFFFFF' } },
      bottom: { style: 'thin', color: { rgb: 'FFFFFFFF' } },
      left: { style: 'thin', color: { rgb: 'FFFFFFFF' } },
      right: { style: 'thin', color: { rgb: 'FFFFFFFF' } }
    }
  };
});

// Set column widths
const colWidths = [18,18,22,32,34,30,20,16,16,24].map(w => ({ wch: w }));
ws['!cols'] = colWidths;
ws['!rows'] = [{ hpt: 28 }];

// Build workbook
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Matriz Pruebas');

// Write file
const outputPath = new URL('./test_matrix.xlsx', import.meta.url).pathname;
XLSX.writeFile(wb, outputPath, { bookType: 'xlsx' });
console.log('Archivo generado:', outputPath);
