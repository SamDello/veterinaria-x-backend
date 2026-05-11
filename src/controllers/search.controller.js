const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

function normalizeNames(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && item.nombre) return item.nombre;
      return null;
    })
    .filter(Boolean)
    .map((item) => item.toUpperCase());
}

function buildPermissionChecker(user) {
  const roles = normalizeNames(user?.roles);
  const permisos = normalizeNames(user?.permisos);
  const isAdmin = roles.includes('ADMINISTRADOR');

  return (...requiredPermissions) => {
    if (isAdmin) return true;

    return requiredPermissions.some((permission) =>
      permisos.includes(permission.toUpperCase())
    );
  };
}

function fullName(nombre, apellidos) {
  return `${nombre || ''} ${apellidos || ''}`.trim() || 'Sin nombre';
}

function matchPage(page, cleanQuery) {
  const value = cleanQuery.toLowerCase();

  const text = [
    page.label,
    page.route,
    page.description,
    ...(page.keywords || []),
  ]
    .join(' ')
    .toLowerCase();

  return text.includes(value);
}

function createPageItems(canAccess, cleanQuery) {
  const pages = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      description: 'Panel principal del sistema',
      keywords: ['inicio', 'principal', 'panel'],
      allowed: true,
    },
    {
      label: 'Clientes',
      route: '/clientes',
      description: 'Gestión de clientes',
      keywords: ['cliente', 'dueño', 'propietario'],
      allowed: canAccess('GESTIONAR_CLIENTES'),
    },
    {
      label: 'Mascotas',
      route: '/mascotas',
      description: 'Gestión de mascotas',
      keywords: ['mascota', 'animal', 'paciente'],
      allowed: canAccess('GESTIONAR_MASCOTAS'),
    },
    {
      label: 'Especies',
      route: '/especies',
      description: 'Gestión de especies',
      keywords: ['especie', 'perro', 'gato'],
      allowed: canAccess('GESTIONAR_ESPECIES'),
    },
    {
      label: 'Razas',
      route: '/razas',
      description: 'Gestión de razas',
      keywords: ['raza'],
      allowed: canAccess('GESTIONAR_RAZAS'),
    },
    {
      label: 'Servicios veterinarios',
      route: '/servicios-veterinarios',
      description: 'Gestión de servicios veterinarios',
      keywords: ['servicio', 'vacuna', 'consulta', 'desparasitacion'],
      allowed: canAccess('GESTIONAR_SERVICIOS_VETERINARIOS'),
    },
    {
      label: 'Atenciones veterinarias',
      route: '/atenciones-veterinarias',
      description: 'Registro de atenciones veterinarias',
      keywords: ['atencion', 'diagnostico', 'tratamiento'],
      allowed: canAccess('REGISTRAR_ATENCION_VETERINARIA'),
    },
    {
      label: 'Historial de atenciones',
      route: '/historial-atenciones',
      description: 'Historial clínico de mascotas',
      keywords: ['historial', 'clinico'],
      allowed: canAccess('REGISTRAR_ATENCION_VETERINARIA'),
    },
    {
      label: 'Ventas',
      route: '/ventas',
      description: 'Registro y consulta de ventas',
      keywords: ['venta', 'factura', 'cliente'],
      allowed: canAccess('REGISTRAR_VENTAS_PRODUCTOS', 'REGISTRAR_VENTAS_SERVICIOS'),
    },
    {
      label: 'Pagos',
      route: '/pagos',
      description: 'Gestión de pagos',
      keywords: ['pago', 'qr', 'libelula', 'cliente'],
      allowed: canAccess('GESTIONAR_PAGOS'),
    },
    {
      label: 'Compras',
      route: '/compras',
      description: 'Registro de compras',
      keywords: ['compra', 'proveedor'],
      allowed: canAccess('REGISTRAR_COMPRAS'),
    },
    {
      label: 'Proveedores',
      route: '/proveedores',
      description: 'Gestión de proveedores',
      keywords: ['proveedor', 'nit'],
      allowed: canAccess('GESTIONAR_PROVEEDORES'),
    },
    {
      label: 'Productos',
      route: '/productos',
      description: 'Gestión de productos',
      keywords: ['producto', 'medicamento', 'alimento'],
      allowed: canAccess('GESTIONAR_PRODUCTOS'),
    },
    {
      label: 'Categorías',
      route: '/categorias',
      description: 'Gestión de categorías',
      keywords: ['categoria'],
      allowed: canAccess('GESTIONAR_CATEGORIAS'),
    },
    {
      label: 'Marcas',
      route: '/marcas',
      description: 'Gestión de marcas',
      keywords: ['marca'],
      allowed: canAccess('GESTIONAR_MARCAS'),
    },
    {
      label: 'Almacenes',
      route: '/almacenes',
      description: 'Gestión de almacenes',
      keywords: ['almacen', 'deposito'],
      allowed: canAccess('GESTIONAR_ALMACENES'),
    },
    {
      label: 'Stock',
      route: '/stock',
      description: 'Control de stock',
      keywords: ['stock', 'inventario', 'existencias'],
      allowed: canAccess('GESTIONAR_STOCK'),
    },
    {
      label: 'Movimientos de inventario',
      route: '/movimientos-inventario',
      description: 'Entradas y salidas de inventario',
      keywords: ['movimiento', 'inventario', 'entrada', 'salida'],
      allowed: canAccess('GESTIONAR_MOVIMIENTOS_INVENTARIO'),
    },
    {
      label: 'Caja',
      route: '/caja',
      description: 'Gestión de cajas',
      keywords: ['caja'],
      allowed: canAccess('GESTIONAR_CAJA'),
    },
    {
      label: 'Apertura de caja',
      route: '/apertura-caja',
      description: 'Registro de apertura de caja',
      keywords: ['apertura', 'caja'],
      allowed: canAccess('REGISTRAR_APERTURA_CAJA'),
    },
    {
      label: 'Cierre de caja',
      route: '/cierre-caja',
      description: 'Registro de cierre de caja',
      keywords: ['cierre', 'caja'],
      allowed: canAccess('REGISTRAR_CIERRE_CAJA'),
    },
    {
      label: 'Movimientos de caja',
      route: '/movimientos-caja',
      description: 'Ingresos y egresos de caja',
      keywords: ['movimiento', 'caja', 'ingreso', 'egreso'],
      allowed: canAccess('GESTIONAR_MOVIMIENTOS_CAJA'),
    },
    {
      label: 'Métodos de pago',
      route: '/metodos-pago',
      description: 'Gestión de métodos de pago',
      keywords: ['metodo', 'pago', 'qr', 'efectivo'],
      allowed: canAccess('GESTIONAR_METODOS_PAGO'),
    },
    {
      label: 'Reportes',
      route: '/reportes',
      description: 'Reportes parametrizados',
      keywords: ['reporte', 'pdf', 'correo'],
      allowed: canAccess('CONSULTAR_REPORTES_OPERATIVOS'),
    },
    {
      label: 'Usuarios',
      route: '/usuarios',
      description: 'Gestión de usuarios',
      keywords: ['usuario', 'login', 'correo'],
      allowed: canAccess('GESTIONAR_USUARIOS'),
    },
    {
      label: 'Roles',
      route: '/roles',
      description: 'Gestión de roles',
      keywords: ['rol', 'permiso'],
      allowed: canAccess('GESTIONAR_ROLES'),
    },
    {
      label: 'Empleados',
      route: '/empleados',
      description: 'Gestión de empleados',
      keywords: ['empleado', 'personal', 'veterinario'],
      allowed: canAccess('GESTIONAR_EMPLEADOS'),
    },
  ];

  return pages
    .filter((page) => page.allowed && matchPage(page, cleanQuery))
    .map((page) => ({
      module: 'paginas',
      type: 'Página',
      label: page.label,
      description: page.description,
      route: page.route,
    }));
}

async function runSql(sql, term) {
  return sequelize.query(sql, {
    replacements: { term },
    type: QueryTypes.SELECT,
  });
}

const modules = [
  {
    key: 'clientes',
    permissions: ['GESTIONAR_CLIENTES'],
    sql: `
      SELECT *
      FROM cliente
      WHERE CONCAT_WS(' ', id_cliente, nombre, apellidos, ci_nit, telefono, correo, direccion) LIKE :term
      ORDER BY id_cliente DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'clientes',
      type: 'Cliente',
      label: fullName(item.nombre, item.apellidos),
      description: `CI/NIT: ${item.ci_nit || 'Sin dato'} | Tel: ${item.telefono || 'Sin dato'}`,
      route: '/clientes',
    }),
  },
  {
    key: 'mascotas',
    permissions: ['GESTIONAR_MASCOTAS'],
    sql: `
      SELECT 
        m.*,
        c.nombre AS cliente_nombre,
        c.apellidos AS cliente_apellidos,
        r.nombre AS raza_nombre,
        e.nombre AS especie_nombre
      FROM mascota m
      INNER JOIN cliente c ON c.id_cliente = m.id_cliente
      INNER JOIN raza r ON r.id_raza = m.id_raza
      INNER JOIN especie e ON e.id_especie = r.id_especie
      WHERE CONCAT_WS(' ', m.id_mascota, m.nombre, m.color, m.sexo, m.observaciones, c.nombre, c.apellidos, c.ci_nit, r.nombre, e.nombre) LIKE :term
      ORDER BY m.id_mascota DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'mascotas',
      type: 'Mascota',
      label: item.nombre || 'Mascota sin nombre',
      description: `Cliente: ${fullName(item.cliente_nombre, item.cliente_apellidos)} | Raza: ${item.raza_nombre || 'Sin dato'}`,
      route: '/mascotas',
    }),
  },
  {
    key: 'especies',
    permissions: ['GESTIONAR_ESPECIES'],
    sql: `
      SELECT *
      FROM especie
      WHERE CONCAT_WS(' ', id_especie, nombre, descripcion) LIKE :term
      ORDER BY id_especie DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'especies',
      type: 'Especie',
      label: item.nombre || 'Especie sin nombre',
      description: item.descripcion || 'Sin descripción',
      route: '/especies',
    }),
  },
  {
    key: 'razas',
    permissions: ['GESTIONAR_RAZAS'],
    sql: `
      SELECT 
        r.*,
        e.nombre AS especie_nombre
      FROM raza r
      INNER JOIN especie e ON e.id_especie = r.id_especie
      WHERE CONCAT_WS(' ', r.id_raza, r.nombre, r.descripcion, e.nombre, e.descripcion) LIKE :term
      ORDER BY r.id_raza DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'razas',
      type: 'Raza',
      label: item.nombre || 'Raza sin nombre',
      description: `Especie: ${item.especie_nombre || 'Sin dato'}`,
      route: '/razas',
    }),
  },
  {
    key: 'servicios',
    permissions: ['GESTIONAR_SERVICIOS_VETERINARIOS'],
    sql: `
      SELECT *
      FROM servicio_veterinario
      WHERE CONCAT_WS(' ', id_servicio, nombre, descripcion, precio) LIKE :term
      ORDER BY id_servicio DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'servicios',
      type: 'Servicio veterinario',
      label: item.nombre || 'Servicio sin nombre',
      description: `Precio: Bs ${item.precio || 0}`,
      route: '/servicios-veterinarios',
    }),
  },
  {
    key: 'atenciones',
    permissions: ['REGISTRAR_ATENCION_VETERINARIA'],
    sql: `
      SELECT
        a.*,
        m.nombre AS mascota_nombre,
        c.nombre AS cliente_nombre,
        c.apellidos AS cliente_apellidos,
        emp.nombre AS empleado_nombre,
        emp.apellidos AS empleado_apellidos,
        servicios.servicios_nombres
      FROM atencion_veterinaria a
      INNER JOIN mascota m ON m.id_mascota = a.id_mascota
      INNER JOIN cliente c ON c.id_cliente = m.id_cliente
      INNER JOIN empleado emp ON emp.id_empleado = a.id_empleado
      LEFT JOIN (
        SELECT 
          ats.id_atencion,
          GROUP_CONCAT(sv.nombre SEPARATOR ', ') AS servicios_nombres
        FROM atencion_servicio ats
        INNER JOIN servicio_veterinario sv ON sv.id_servicio = ats.id_servicio
        GROUP BY ats.id_atencion
      ) servicios ON servicios.id_atencion = a.id_atencion
      WHERE CONCAT_WS(' ', a.id_atencion, a.motivo_consulta, a.diagnostico, a.tratamiento, a.observaciones, a.estado_cobro, m.nombre, c.nombre, c.apellidos, emp.nombre, emp.apellidos, servicios.servicios_nombres) LIKE :term
      ORDER BY a.id_atencion DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'atenciones',
      type: 'Atención veterinaria',
      label: `Atención #${item.id_atencion}`,
      description: `Mascota: ${item.mascota_nombre || 'Sin dato'} | Cliente: ${fullName(item.cliente_nombre, item.cliente_apellidos)} | Estado: ${item.estado_cobro}`,
      route: '/historial-atenciones',
    }),
  },
  {
    key: 'productos',
    permissions: ['GESTIONAR_PRODUCTOS'],
    sql: `
      SELECT 
        p.*,
        c.nombre AS categoria_nombre,
        m.nombre AS marca_nombre
      FROM producto p
      INNER JOIN categoria c ON c.id_categoria = p.id_categoria
      INNER JOIN marca m ON m.id_marca = p.id_marca
      WHERE CONCAT_WS(' ', p.id_producto, p.nombre, p.descripcion, p.precio_compra, p.precio_venta, c.nombre, m.nombre) LIKE :term
      ORDER BY p.id_producto DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'productos',
      type: 'Producto',
      label: item.nombre || 'Producto sin nombre',
      description: `Categoría: ${item.categoria_nombre || 'Sin dato'} | Marca: ${item.marca_nombre || 'Sin dato'} | Precio: Bs ${item.precio_venta || 0}`,
      route: '/productos',
    }),
  },
  {
    key: 'categorias',
    permissions: ['GESTIONAR_CATEGORIAS'],
    sql: `
      SELECT *
      FROM categoria
      WHERE CONCAT_WS(' ', id_categoria, nombre, descripcion) LIKE :term
      ORDER BY id_categoria DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'categorias',
      type: 'Categoría',
      label: item.nombre || 'Categoría sin nombre',
      description: item.descripcion || 'Sin descripción',
      route: '/categorias',
    }),
  },
  {
    key: 'marcas',
    permissions: ['GESTIONAR_MARCAS'],
    sql: `
      SELECT *
      FROM marca
      WHERE CONCAT_WS(' ', id_marca, nombre, descripcion) LIKE :term
      ORDER BY id_marca DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'marcas',
      type: 'Marca',
      label: item.nombre || 'Marca sin nombre',
      description: item.descripcion || 'Sin descripción',
      route: '/marcas',
    }),
  },
  {
    key: 'almacenes',
    permissions: ['GESTIONAR_ALMACENES'],
    sql: `
      SELECT *
      FROM almacen
      WHERE CONCAT_WS(' ', id_almacen, nombre, descripcion, ubicacion) LIKE :term
      ORDER BY id_almacen DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'almacenes',
      type: 'Almacén',
      label: item.nombre || 'Almacén sin nombre',
      description: item.ubicacion || 'Sin ubicación',
      route: '/almacenes',
    }),
  },
  {
    key: 'stock',
    permissions: ['GESTIONAR_STOCK'],
    sql: `
      SELECT
        st.*,
        p.nombre AS producto_nombre,
        a.nombre AS almacen_nombre
      FROM stock st
      INNER JOIN producto p ON p.id_producto = st.id_producto
      INNER JOIN almacen a ON a.id_almacen = st.id_almacen
      WHERE CONCAT_WS(' ', st.id_stock, st.stock_actual, st.stock_minimo, st.stock_maximo, p.nombre, p.descripcion, a.nombre, a.ubicacion) LIKE :term
      ORDER BY st.id_stock DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'stock',
      type: 'Stock',
      label: item.producto_nombre || `Stock #${item.id_stock}`,
      description: `Almacén: ${item.almacen_nombre || 'Sin dato'} | Actual: ${item.stock_actual}`,
      route: '/stock',
    }),
  },
  {
    key: 'movimientos_inventario',
    permissions: ['GESTIONAR_MOVIMIENTOS_INVENTARIO'],
    sql: `
      SELECT
        mi.*,
        p.nombre AS producto_nombre,
        a.nombre AS almacen_nombre,
        e.nombre AS empleado_nombre,
        e.apellidos AS empleado_apellidos
      FROM movimiento_inventario mi
      INNER JOIN producto p ON p.id_producto = mi.id_producto
      INNER JOIN almacen a ON a.id_almacen = mi.id_almacen
      INNER JOIN empleado e ON e.id_empleado = mi.id_empleado
      WHERE CONCAT_WS(' ', mi.id_movimiento_inventario, mi.tipo_movimiento, mi.cantidad, mi.motivo, mi.referencia_tipo, mi.referencia_id, p.nombre, a.nombre, e.nombre, e.apellidos) LIKE :term
      ORDER BY mi.id_movimiento_inventario DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'movimientos_inventario',
      type: 'Movimiento inventario',
      label: `${item.tipo_movimiento || 'Movimiento'} #${item.id_movimiento_inventario}`,
      description: `Producto: ${item.producto_nombre || 'Sin dato'} | Almacén: ${item.almacen_nombre || 'Sin dato'} | Cantidad: ${item.cantidad}`,
      route: '/movimientos-inventario',
    }),
  },
  {
    key: 'proveedores',
    permissions: ['GESTIONAR_PROVEEDORES'],
    sql: `
      SELECT *
      FROM proveedor
      WHERE CONCAT_WS(' ', id_proveedor, nombre, nit, telefono, correo, direccion) LIKE :term
      ORDER BY id_proveedor DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'proveedores',
      type: 'Proveedor',
      label: item.nombre || 'Proveedor sin nombre',
      description: `NIT: ${item.nit || 'Sin dato'} | Tel: ${item.telefono || 'Sin dato'}`,
      route: '/proveedores',
    }),
  },
  {
    key: 'compras',
    permissions: ['REGISTRAR_COMPRAS'],
    sql: `
      SELECT
        co.*,
        pr.nombre AS proveedor_nombre,
        pr.nit AS proveedor_nit,
        e.nombre AS empleado_nombre,
        e.apellidos AS empleado_apellidos,
        a.nombre AS almacen_nombre,
        productos.productos_nombres
      FROM compra co
      INNER JOIN proveedor pr ON pr.id_proveedor = co.id_proveedor
      INNER JOIN empleado e ON e.id_empleado = co.id_empleado
      INNER JOIN almacen a ON a.id_almacen = co.id_almacen
      LEFT JOIN (
        SELECT
          dc.id_compra,
          GROUP_CONCAT(p.nombre SEPARATOR ', ') AS productos_nombres
        FROM detalle_compra dc
        INNER JOIN producto p ON p.id_producto = dc.id_producto
        GROUP BY dc.id_compra
      ) productos ON productos.id_compra = co.id_compra
      WHERE CONCAT_WS(' ', co.id_compra, co.observacion, co.subtotal, co.total, pr.nombre, pr.nit, e.nombre, e.apellidos, a.nombre, productos.productos_nombres) LIKE :term
      ORDER BY co.id_compra DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'compras',
      type: 'Compra',
      label: `Compra #${item.id_compra}`,
      description: `Proveedor: ${item.proveedor_nombre || 'Sin dato'} | Total: Bs ${item.total || 0}`,
      route: '/compras',
    }),
  },
  {
    key: 'ventas',
    permissions: ['REGISTRAR_VENTAS_PRODUCTOS', 'REGISTRAR_VENTAS_SERVICIOS'],
    sql: `
      SELECT
        v.*,
        c.nombre AS cliente_nombre,
        c.apellidos AS cliente_apellidos,
        c.ci_nit AS cliente_ci_nit,
        e.nombre AS empleado_nombre,
        e.apellidos AS empleado_apellidos,
        av.id_mascota,
        m.nombre AS mascota_nombre,
        productos.productos_nombres,
        servicios.servicios_nombres
      FROM venta v
      INNER JOIN cliente c ON c.id_cliente = v.id_cliente
      INNER JOIN empleado e ON e.id_empleado = v.id_empleado
      LEFT JOIN atencion_veterinaria av ON av.id_atencion = v.id_atencion
      LEFT JOIN mascota m ON m.id_mascota = av.id_mascota
      LEFT JOIN (
        SELECT
          dvp.id_venta,
          GROUP_CONCAT(p.nombre SEPARATOR ', ') AS productos_nombres
        FROM detalle_venta_producto dvp
        INNER JOIN producto p ON p.id_producto = dvp.id_producto
        GROUP BY dvp.id_venta
      ) productos ON productos.id_venta = v.id_venta
      LEFT JOIN (
        SELECT
          dvs.id_venta,
          GROUP_CONCAT(sv.nombre SEPARATOR ', ') AS servicios_nombres
        FROM detalle_venta_servicio dvs
        INNER JOIN servicio_veterinario sv ON sv.id_servicio = dvs.id_servicio
        GROUP BY dvs.id_venta
      ) servicios ON servicios.id_venta = v.id_venta
      WHERE CONCAT_WS(' ', v.id_venta, v.observacion, v.subtotal, v.descuento, v.total, c.nombre, c.apellidos, c.ci_nit, e.nombre, e.apellidos, m.nombre, productos.productos_nombres, servicios.servicios_nombres) LIKE :term
      ORDER BY v.id_venta DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'ventas',
      type: 'Venta',
      label: `Venta #${item.id_venta}`,
      description: `Cliente: ${fullName(item.cliente_nombre, item.cliente_apellidos)} | Mascota: ${item.mascota_nombre || '-'} | Total: Bs ${item.total || 0}`,
      route: '/ventas',
    }),
  },
  {
    key: 'pagos',
    permissions: ['GESTIONAR_PAGOS'],
    sql: `
      SELECT
        pa.*,
        v.total AS venta_total,
        c.nombre AS cliente_nombre,
        c.apellidos AS cliente_apellidos,
        c.ci_nit AS cliente_ci_nit,
        e.nombre AS empleado_nombre,
        e.apellidos AS empleado_apellidos,
        mp.nombre AS metodo_nombre,
        qr.estado_libelula,
        qr.identificador_deuda,
        qr.codigo_transaccion_libelula
      FROM pago pa
      INNER JOIN venta v ON v.id_venta = pa.id_venta
      INNER JOIN cliente c ON c.id_cliente = v.id_cliente
      INNER JOIN empleado e ON e.id_empleado = v.id_empleado
      INNER JOIN metodo_pago mp ON mp.id_metodo_pago = pa.id_metodo_pago
      LEFT JOIN pago_qr_libelula qr ON qr.id_pago = pa.id_pago
      WHERE CONCAT_WS(' ', pa.id_pago, pa.id_venta, pa.monto, pa.estado, pa.observacion, pa.referencia_externa, c.nombre, c.apellidos, c.ci_nit, e.nombre, e.apellidos, mp.nombre, mp.descripcion, qr.estado_libelula, qr.identificador_deuda, qr.codigo_transaccion_libelula) LIKE :term
      ORDER BY pa.id_pago DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'pagos',
      type: 'Pago',
      label: `Pago #${item.id_pago}`,
      description: `Cliente: ${fullName(item.cliente_nombre, item.cliente_apellidos)} | Venta #${item.id_venta} | Método: ${item.metodo_nombre || 'Sin dato'} | Monto: Bs ${item.monto || 0}`,
      route: '/pagos',
    }),
  },
  {
    key: 'metodos_pago',
    permissions: ['GESTIONAR_METODOS_PAGO'],
    sql: `
      SELECT *
      FROM metodo_pago
      WHERE CONCAT_WS(' ', id_metodo_pago, nombre, descripcion) LIKE :term
      ORDER BY id_metodo_pago DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'metodos_pago',
      type: 'Método de pago',
      label: item.nombre || 'Método sin nombre',
      description: item.descripcion || 'Sin descripción',
      route: '/metodos-pago',
    }),
  },
  {
    key: 'caja',
    permissions: ['GESTIONAR_CAJA'],
    sql: `
      SELECT *
      FROM caja
      WHERE CONCAT_WS(' ', id_caja, nombre, descripcion, ubicacion) LIKE :term
      ORDER BY id_caja DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'caja',
      type: 'Caja',
      label: item.nombre || 'Caja sin nombre',
      description: item.ubicacion || 'Sin ubicación',
      route: '/caja',
    }),
  },
  {
    key: 'aperturas_caja',
    permissions: ['REGISTRAR_APERTURA_CAJA'],
    sql: `
      SELECT
        ac.*,
        ca.nombre AS caja_nombre,
        e.nombre AS empleado_nombre,
        e.apellidos AS empleado_apellidos
      FROM apertura_caja ac
      INNER JOIN caja ca ON ca.id_caja = ac.id_caja
      INNER JOIN empleado e ON e.id_empleado = ac.id_empleado
      WHERE CONCAT_WS(' ', ac.id_apertura_caja, ac.monto_inicial, ac.estado, ca.nombre, ca.ubicacion, e.nombre, e.apellidos) LIKE :term
      ORDER BY ac.id_apertura_caja DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'aperturas_caja',
      type: 'Apertura de caja',
      label: `Apertura #${item.id_apertura_caja}`,
      description: `Caja: ${item.caja_nombre || 'Sin dato'} | Empleado: ${fullName(item.empleado_nombre, item.empleado_apellidos)} | Estado: ${item.estado}`,
      route: '/apertura-caja',
    }),
  },
  {
    key: 'cierres_caja',
    permissions: ['REGISTRAR_CIERRE_CAJA'],
    sql: `
      SELECT
        cc.*,
        ac.id_caja,
        ca.nombre AS caja_nombre,
        e.nombre AS empleado_nombre,
        e.apellidos AS empleado_apellidos
      FROM cierre_caja cc
      INNER JOIN apertura_caja ac ON ac.id_apertura_caja = cc.id_apertura_caja
      INNER JOIN caja ca ON ca.id_caja = ac.id_caja
      INNER JOIN empleado e ON e.id_empleado = cc.id_empleado
      WHERE CONCAT_WS(' ', cc.id_cierre_caja, cc.id_apertura_caja, cc.monto_final, cc.observacion, ca.nombre, e.nombre, e.apellidos) LIKE :term
      ORDER BY cc.id_cierre_caja DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'cierres_caja',
      type: 'Cierre de caja',
      label: `Cierre #${item.id_cierre_caja}`,
      description: `Caja: ${item.caja_nombre || 'Sin dato'} | Monto final: Bs ${item.monto_final || 0}`,
      route: '/cierre-caja',
    }),
  },
  {
    key: 'movimientos_caja',
    permissions: ['GESTIONAR_MOVIMIENTOS_CAJA'],
    sql: `
      SELECT
        mc.*,
        ca.nombre AS caja_nombre,
        e.nombre AS empleado_nombre,
        e.apellidos AS empleado_apellidos,
        mp.nombre AS metodo_nombre,
        pa.id_venta,
        c.nombre AS cliente_nombre,
        c.apellidos AS cliente_apellidos
      FROM movimiento_caja mc
      INNER JOIN apertura_caja ac ON ac.id_apertura_caja = mc.id_apertura_caja
      INNER JOIN caja ca ON ca.id_caja = ac.id_caja
      INNER JOIN empleado e ON e.id_empleado = mc.id_empleado
      INNER JOIN metodo_pago mp ON mp.id_metodo_pago = mc.id_metodo_pago
      LEFT JOIN pago pa ON pa.id_pago = mc.id_pago
      LEFT JOIN venta v ON v.id_venta = pa.id_venta
      LEFT JOIN cliente c ON c.id_cliente = v.id_cliente
      WHERE CONCAT_WS(' ', mc.id_movimiento_caja, mc.tipo_movimiento, mc.monto, mc.observacion, mc.referencia_tipo, mc.referencia_id, ca.nombre, e.nombre, e.apellidos, mp.nombre, c.nombre, c.apellidos) LIKE :term
      ORDER BY mc.id_movimiento_caja DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'movimientos_caja',
      type: 'Movimiento de caja',
      label: `${item.tipo_movimiento || 'Movimiento'} #${item.id_movimiento_caja}`,
      description: `Caja: ${item.caja_nombre || 'Sin dato'} | Cliente: ${fullName(item.cliente_nombre, item.cliente_apellidos)} | Monto: Bs ${item.monto || 0}`,
      route: '/movimientos-caja',
    }),
  },
  {
    key: 'usuarios',
    permissions: ['GESTIONAR_USUARIOS'],
    sql: `
      SELECT
        u.id_usuario,
        u.username,
        u.correo,
        u.estado,
        roles.roles_nombres
      FROM usuario u
      LEFT JOIN (
        SELECT
          ur.id_usuario,
          GROUP_CONCAT(r.nombre SEPARATOR ', ') AS roles_nombres
        FROM usuario_rol ur
        INNER JOIN rol r ON r.id_rol = ur.id_rol
        GROUP BY ur.id_usuario
      ) roles ON roles.id_usuario = u.id_usuario
      WHERE CONCAT_WS(' ', u.id_usuario, u.username, u.correo, roles.roles_nombres) LIKE :term
      ORDER BY u.id_usuario DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'usuarios',
      type: 'Usuario',
      label: item.username || 'Usuario sin nombre',
      description: `Correo: ${item.correo || 'Sin dato'} | Rol: ${item.roles_nombres || 'Sin rol'}`,
      route: '/usuarios',
    }),
  },
  {
    key: 'roles',
    permissions: ['GESTIONAR_ROLES'],
    sql: `
      SELECT
        r.*,
        permisos.permisos_nombres
      FROM rol r
      LEFT JOIN (
        SELECT
          rp.id_rol,
          GROUP_CONCAT(p.nombre SEPARATOR ', ') AS permisos_nombres
        FROM rol_permiso rp
        INNER JOIN permiso p ON p.id_permiso = rp.id_permiso
        GROUP BY rp.id_rol
      ) permisos ON permisos.id_rol = r.id_rol
      WHERE CONCAT_WS(' ', r.id_rol, r.nombre, r.descripcion, permisos.permisos_nombres) LIKE :term
      ORDER BY r.id_rol DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'roles',
      type: 'Rol',
      label: item.nombre || 'Rol sin nombre',
      description: item.descripcion || 'Sin descripción',
      route: '/roles',
    }),
  },
  {
    key: 'empleados',
    permissions: ['GESTIONAR_EMPLEADOS'],
    sql: `
      SELECT
        e.*,
        u.username,
        u.correo
      FROM empleado e
      LEFT JOIN usuario u ON u.id_usuario = e.id_usuario
      WHERE CONCAT_WS(' ', e.id_empleado, e.nombre, e.apellidos, e.ci, e.telefono, e.direccion, e.cargo, e.especialidad, u.username, u.correo) LIKE :term
      ORDER BY e.id_empleado DESC
      LIMIT 10
    `,
    map: (item) => ({
      module: 'empleados',
      type: 'Empleado',
      label: fullName(item.nombre, item.apellidos),
      description: `Cargo: ${item.cargo || 'Sin dato'} | Usuario: ${item.username || 'Sin usuario'}`,
      route: '/empleados',
    }),
  },
];

async function globalSearch(req, res) {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        ok: false,
        message: 'Debe enviar el parametro de busqueda q.',
      });
    }

    const cleanQuery = q.trim();
    const term = `%${cleanQuery}%`;
    const canAccess = buildPermissionChecker(req.user);

    const items = [];
    const results = {};
    const summary = {};

    const pageItems = createPageItems(canAccess, cleanQuery);

    results.paginas = pageItems;
    summary.paginas = pageItems.length;
    items.push(...pageItems);

    for (const moduleConfig of modules) {
      if (!canAccess(...moduleConfig.permissions)) {
        results[moduleConfig.key] = [];
        summary[moduleConfig.key] = 0;
        continue;
      }

      const data = await runSql(moduleConfig.sql, term);
      const moduleItems = data.map(moduleConfig.map);

      results[moduleConfig.key] = moduleItems;
      summary[moduleConfig.key] = moduleItems.length;
      items.push(...moduleItems);
    }

    return res.status(200).json({
      ok: true,
      query: cleanQuery,
      items,
      results,
      summary,
    });
  } catch (error) {
    console.error('ERROR GLOBAL SEARCH:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al realizar la busqueda global.',
      error: error.message,
    });
  }
}

module.exports = {
  globalSearch,
};