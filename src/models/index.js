const sequelize = require('../config/database');

const Usuario = require('./usuario.model');
const Rol = require('./rol.model');
const Permiso = require('./permiso.model');
const UsuarioRol = require('./usuarioRol.model');
const RolPermiso = require('./rolPermiso.model');
const Empleado = require('./empleado.model');
const Cliente = require('./cliente.model');
const Mascota = require('./mascota.model');
const Especie = require('./especie.model');
const Raza = require('./raza.model');
const ServicioVeterinario = require('./servicioVeterinario.model');
const AtencionVeterinaria = require('./atencionVeterinaria.model');
const AtencionServicio = require('./atencionServicio.model');
const Categoria = require('./categoria.model');
const Marca = require('./marca.model');
const Producto = require('./producto.model');
const Almacen = require('./almacen.model');
const Stock = require('./stock.model');
const MovimientoInventario = require('./movimientoInventario.model');
const Proveedor = require('./proveedor.model');
const Compra = require('./compra.model');
const DetalleCompra = require('./detalleCompra.model');
const MetodoPago = require('./metodoPago.model');
const Venta = require('./venta.model');
const DetalleVentaProducto = require('./detalleVentaProducto.model');
const DetalleVentaServicio = require('./detalleVentaServicio.model');
const Pago = require('./pago.model');
const Caja = require('./caja.model');
const PagoQrLibelula = require('./pagoQrLibelula.model');
const AperturaCaja = require('./aperturaCaja.model');
const CierreCaja = require('./cierreCaja.model');
const MovimientoCaja = require('./movimientoCaja.model');
const PageVisit = require('./pageVisit.model');
const InventarioLote = require('./InventarioLote');
const InventarioLoteMovimiento = require('./InventarioLoteMovimiento');
const Traspaso = require('./Traspaso');
const TraspasoDetalle = require('./TraspasoDetalle');



// Usuario <-> Rol
Usuario.belongsToMany(Rol, {
  through: UsuarioRol,
  foreignKey: 'id_usuario',
  otherKey: 'id_rol',
  as: 'roles',
});

Rol.belongsToMany(Usuario, {
  through: UsuarioRol,
  foreignKey: 'id_rol',
  otherKey: 'id_usuario',
  as: 'usuarios',
});

// Rol <-> Permiso
Rol.belongsToMany(Permiso, {
  through: RolPermiso,
  foreignKey: 'id_rol',
  otherKey: 'id_permiso',
  as: 'permisos',
});

Permiso.belongsToMany(Rol, {
  through: RolPermiso,
  foreignKey: 'id_permiso',
  otherKey: 'id_rol',
  as: 'roles',
});

// Usuario <-> Empleado
Usuario.hasOne(Empleado, {
  foreignKey: 'id_usuario',
  as: 'empleado',
});

Empleado.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario',
});
// Especie <-> Raza
Especie.hasMany(Raza, {
  foreignKey: 'id_especie',
  as: 'razas',
});

Raza.belongsTo(Especie, {
  foreignKey: 'id_especie',
  as: 'especie',
});

// Cliente <-> Mascota
Cliente.hasMany(Mascota, {
  foreignKey: 'id_cliente',
  as: 'mascotas',
});

Mascota.belongsTo(Cliente, {
  foreignKey: 'id_cliente',
  as: 'cliente',
});

// Raza <-> Mascota
Raza.hasMany(Mascota, {
  foreignKey: 'id_raza',
  as: 'mascotas',
});

Mascota.belongsTo(Raza, {
  foreignKey: 'id_raza',
  as: 'raza',
});
// Mascota <-> AtencionVeterinaria
Mascota.hasMany(AtencionVeterinaria, {
  foreignKey: 'id_mascota',
  as: 'atenciones',
});

AtencionVeterinaria.belongsTo(Mascota, {
  foreignKey: 'id_mascota',
  as: 'mascota',
});

// Empleado <-> AtencionVeterinaria
Empleado.hasMany(AtencionVeterinaria, {
  foreignKey: 'id_empleado',
  as: 'atenciones',
});

AtencionVeterinaria.belongsTo(Empleado, {
  foreignKey: 'id_empleado',
  as: 'empleado',
});

// AtencionVeterinaria <-> ServicioVeterinario mediante AtencionServicio
AtencionVeterinaria.belongsToMany(ServicioVeterinario, {
  through: AtencionServicio,
  foreignKey: 'id_atencion',
  otherKey: 'id_servicio',
  as: 'servicios',
});

ServicioVeterinario.belongsToMany(AtencionVeterinaria, {
  through: AtencionServicio,
  foreignKey: 'id_servicio',
  otherKey: 'id_atencion',
  as: 'atenciones',
});

// Categoria <-> Producto
Categoria.hasMany(Producto, {
  foreignKey: 'id_categoria',
  as: 'productos',
});

Producto.belongsTo(Categoria, {
  foreignKey: 'id_categoria',
  as: 'categoria',
});

// Marca <-> Producto
Marca.hasMany(Producto, {
  foreignKey: 'id_marca',
  as: 'productos',
});

Producto.belongsTo(Marca, {
  foreignKey: 'id_marca',
  as: 'marca',
});

// Almacen <-> Stock
Almacen.hasMany(Stock, {
  foreignKey: 'id_almacen',
  as: 'stocks',
});

Stock.belongsTo(Almacen, {
  foreignKey: 'id_almacen',
  as: 'almacen',
});

// Producto <-> Stock
Producto.hasMany(Stock, {
  foreignKey: 'id_producto',
  as: 'stocks',
});

Stock.belongsTo(Producto, {
  foreignKey: 'id_producto',
  as: 'producto',
});

// Almacen <-> MovimientoInventario
Almacen.hasMany(MovimientoInventario, {
  foreignKey: 'id_almacen',
  as: 'movimientosInventario',
});

MovimientoInventario.belongsTo(Almacen, {
  foreignKey: 'id_almacen',
  as: 'almacen',
});

// Producto <-> MovimientoInventario
Producto.hasMany(MovimientoInventario, {
  foreignKey: 'id_producto',
  as: 'movimientosInventario',
});

MovimientoInventario.belongsTo(Producto, {
  foreignKey: 'id_producto',
  as: 'producto',
});

// Empleado <-> MovimientoInventario
Empleado.hasMany(MovimientoInventario, {
  foreignKey: 'id_empleado',
  as: 'movimientosInventario',
});

MovimientoInventario.belongsTo(Empleado, {
  foreignKey: 'id_empleado',
  as: 'empleado',
});

// Proveedor <-> Compra
Proveedor.hasMany(Compra, {
  foreignKey: 'id_proveedor',
  as: 'compras',
});

Compra.belongsTo(Proveedor, {
  foreignKey: 'id_proveedor',
  as: 'proveedor',
});

// Empleado <-> Compra
Empleado.hasMany(Compra, {
  foreignKey: 'id_empleado',
  as: 'compras',
});

Compra.belongsTo(Empleado, {
  foreignKey: 'id_empleado',
  as: 'empleado',
});

// Almacen <-> Compra
Almacen.hasMany(Compra, {
  foreignKey: 'id_almacen',
  as: 'compras',
});

Compra.belongsTo(Almacen, {
  foreignKey: 'id_almacen',
  as: 'almacen',
});

// Compra <-> DetalleCompra
Compra.hasMany(DetalleCompra, {
  foreignKey: 'id_compra',
  as: 'detalles',
});

DetalleCompra.belongsTo(Compra, {
  foreignKey: 'id_compra',
  as: 'compra',
});

// Producto <-> DetalleCompra
Producto.hasMany(DetalleCompra, {
  foreignKey: 'id_producto',
  as: 'detallesCompra',
});

DetalleCompra.belongsTo(Producto, {
  foreignKey: 'id_producto',
  as: 'producto',
});

// Cliente <-> Venta
Cliente.hasMany(Venta, {
  foreignKey: 'id_cliente',
  as: 'ventas',
});

Venta.belongsTo(Cliente, {
  foreignKey: 'id_cliente',
  as: 'cliente',
});

// Empleado <-> Venta
Empleado.hasMany(Venta, {
  foreignKey: 'id_empleado',
  as: 'ventas',
});

Venta.belongsTo(Empleado, {
  foreignKey: 'id_empleado',
  as: 'empleado',
});

// Venta <-> DetalleVentaProducto
Venta.hasMany(DetalleVentaProducto, {
  foreignKey: 'id_venta',
  as: 'detalleProductos',
});

DetalleVentaProducto.belongsTo(Venta, {
  foreignKey: 'id_venta',
  as: 'venta',
});

// Producto <-> DetalleVentaProducto
Producto.hasMany(DetalleVentaProducto, {
  foreignKey: 'id_producto',
  as: 'detalleVentasProducto',
});

DetalleVentaProducto.belongsTo(Producto, {
  foreignKey: 'id_producto',
  as: 'producto',
});

// AtencionVeterinaria <-> Venta
AtencionVeterinaria.hasMany(Venta, {
  foreignKey: 'id_atencion',
  as: 'ventas',
});

Venta.belongsTo(AtencionVeterinaria, {
  foreignKey: 'id_atencion',
  as: 'atencion',
});

// Venta <-> DetalleVentaServicio
Venta.hasMany(DetalleVentaServicio, {
  foreignKey: 'id_venta',
  as: 'detalleServicios',
});

DetalleVentaServicio.belongsTo(Venta, {
  foreignKey: 'id_venta',
  as: 'venta',
});

// ServicioVeterinario <-> DetalleVentaServicio
ServicioVeterinario.hasMany(DetalleVentaServicio, {
  foreignKey: 'id_servicio',
  as: 'detalleVentasServicio',
});

DetalleVentaServicio.belongsTo(ServicioVeterinario, {
  foreignKey: 'id_servicio',
  as: 'servicio',
});

// MetodoPago <-> Pago
MetodoPago.hasMany(Pago, {
  foreignKey: 'id_metodo_pago',
  as: 'pagos',
});

Pago.belongsTo(MetodoPago, {
  foreignKey: 'id_metodo_pago',
  as: 'metodoPago',
});

// Venta <-> Pago
Venta.hasMany(Pago, {
  foreignKey: 'id_venta',
  as: 'pagos',
});

Pago.belongsTo(Venta, {
  foreignKey: 'id_venta',
  as: 'venta',
});

// Caja <-> AperturaCaja
Caja.hasMany(AperturaCaja, {
  foreignKey: 'id_caja',
  as: 'aperturas',
});

AperturaCaja.belongsTo(Caja, {
  foreignKey: 'id_caja',
  as: 'caja',
});

// Empleado <-> AperturaCaja
Empleado.hasMany(AperturaCaja, {
  foreignKey: 'id_empleado',
  as: 'aperturasCaja',
});

AperturaCaja.belongsTo(Empleado, {
  foreignKey: 'id_empleado',
  as: 'empleado',
});

// AperturaCaja <-> CierreCaja
AperturaCaja.hasOne(CierreCaja, {
  foreignKey: 'id_apertura_caja',
  as: 'cierre',
});

CierreCaja.belongsTo(AperturaCaja, {
  foreignKey: 'id_apertura_caja',
  as: 'apertura',
});

// Empleado <-> CierreCaja
Empleado.hasMany(CierreCaja, {
  foreignKey: 'id_empleado',
  as: 'cierresCaja',
});

CierreCaja.belongsTo(Empleado, {
  foreignKey: 'id_empleado',
  as: 'empleado',
});

// AperturaCaja <-> MovimientoCaja
AperturaCaja.hasMany(MovimientoCaja, {
  foreignKey: 'id_apertura_caja',
  as: 'movimientosCaja',
});

MovimientoCaja.belongsTo(AperturaCaja, {
  foreignKey: 'id_apertura_caja',
  as: 'aperturaCaja',
});

// Empleado <-> MovimientoCaja
Empleado.hasMany(MovimientoCaja, {
  foreignKey: 'id_empleado',
  as: 'movimientosCaja',
});

MovimientoCaja.belongsTo(Empleado, {
  foreignKey: 'id_empleado',
  as: 'empleado',
});

// MetodoPago <-> MovimientoCaja
MetodoPago.hasMany(MovimientoCaja, {
  foreignKey: 'id_metodo_pago',
  as: 'movimientosCaja',
});

MovimientoCaja.belongsTo(MetodoPago, {
  foreignKey: 'id_metodo_pago',
  as: 'metodoPago',
});

// Pago <-> MovimientoCaja
Pago.hasMany(MovimientoCaja, {
  foreignKey: 'id_pago',
  as: 'movimientosCaja',
});

MovimientoCaja.belongsTo(Pago, {
  foreignKey: 'id_pago',
  as: 'pago',
});

// Pago <-> PagoQrLibelula
Pago.hasOne(PagoQrLibelula, {
  foreignKey: 'id_pago',
  as: 'pagoQrLibelula',
});

PagoQrLibelula.belongsTo(Pago, {
  foreignKey: 'id_pago',
  as: 'pago',
});

// Venta <-> PagoQrLibelula
Venta.hasMany(PagoQrLibelula, {
  foreignKey: 'id_venta',
  as: 'pagosQrLibelula',
});

PagoQrLibelula.belongsTo(Venta, {
  foreignKey: 'id_venta',
  as: 'venta',
});


// ===============================
// RELACIONES FIFO INVENTARIO
// ===============================

Producto.hasMany(InventarioLote, {
  foreignKey: 'id_producto',
  as: 'lotesInventario'
});

InventarioLote.belongsTo(Producto, {
  foreignKey: 'id_producto',
  as: 'producto'
});

Almacen.hasMany(InventarioLote, {
  foreignKey: 'id_almacen',
  as: 'lotesInventario'
});

InventarioLote.belongsTo(Almacen, {
  foreignKey: 'id_almacen',
  as: 'almacen'
});

Compra.hasMany(InventarioLote, {
  foreignKey: 'id_compra',
  as: 'lotesInventario'
});

InventarioLote.belongsTo(Compra, {
  foreignKey: 'id_compra',
  as: 'compra'
});

InventarioLote.hasMany(InventarioLoteMovimiento, {
  foreignKey: 'id_lote',
  as: 'movimientos'
});

InventarioLoteMovimiento.belongsTo(InventarioLote, {
  foreignKey: 'id_lote',
  as: 'lote'
});

Producto.hasMany(InventarioLoteMovimiento, {
  foreignKey: 'id_producto',
  as: 'movimientosLote'
});

InventarioLoteMovimiento.belongsTo(Producto, {
  foreignKey: 'id_producto',
  as: 'producto'
});

Almacen.hasMany(InventarioLoteMovimiento, {
  foreignKey: 'id_almacen_origen',
  as: 'movimientosOrigenLote'
});

InventarioLoteMovimiento.belongsTo(Almacen, {
  foreignKey: 'id_almacen_origen',
  as: 'almacenOrigen'
});

Almacen.hasMany(InventarioLoteMovimiento, {
  foreignKey: 'id_almacen_destino',
  as: 'movimientosDestinoLote'
});

InventarioLoteMovimiento.belongsTo(Almacen, {
  foreignKey: 'id_almacen_destino',
  as: 'almacenDestino'
});

Empleado.hasMany(InventarioLoteMovimiento, {
  foreignKey: 'id_empleado',
  as: 'movimientosLote'
});

InventarioLoteMovimiento.belongsTo(Empleado, {
  foreignKey: 'id_empleado',
  as: 'empleado'
});

// ===============================
// RELACIONES TRASPASOS
// ===============================

Almacen.hasMany(Traspaso, {
  foreignKey: 'id_almacen_origen',
  as: 'traspasosOrigen'
});

Traspaso.belongsTo(Almacen, {
  foreignKey: 'id_almacen_origen',
  as: 'almacenOrigen'
});

Almacen.hasMany(Traspaso, {
  foreignKey: 'id_almacen_destino',
  as: 'traspasosDestino'
});

Traspaso.belongsTo(Almacen, {
  foreignKey: 'id_almacen_destino',
  as: 'almacenDestino'
});

Empleado.hasMany(Traspaso, {
  foreignKey: 'id_empleado',
  as: 'traspasos'
});

Traspaso.belongsTo(Empleado, {
  foreignKey: 'id_empleado',
  as: 'empleado'
});

Traspaso.hasMany(TraspasoDetalle, {
  foreignKey: 'id_traspaso',
  as: 'detalles'
});

TraspasoDetalle.belongsTo(Traspaso, {
  foreignKey: 'id_traspaso',
  as: 'traspaso'
});

Producto.hasMany(TraspasoDetalle, {
  foreignKey: 'id_producto',
  as: 'traspasoDetalles'
});

TraspasoDetalle.belongsTo(Producto, {
  foreignKey: 'id_producto',
  as: 'producto'
});

Traspaso.hasMany(InventarioLote, {
  foreignKey: 'id_traspaso',
  as: 'lotesGenerados'
});

InventarioLote.belongsTo(Traspaso, {
  foreignKey: 'id_traspaso',
  as: 'traspaso'
});

TraspasoDetalle.hasMany(InventarioLote, {
  foreignKey: 'id_traspaso_detalle',
  as: 'lotesGenerados'
});

InventarioLote.belongsTo(TraspasoDetalle, {
  foreignKey: 'id_traspaso_detalle',
  as: 'traspasoDetalle'
});


module.exports = {
  sequelize,
  Usuario,
  Rol,
  Permiso,
  UsuarioRol,
  RolPermiso,
  Empleado,
  Cliente,
  Mascota,
  Especie,
  Raza,
  ServicioVeterinario,
  AtencionVeterinaria,
  AtencionServicio,
  Categoria,
  Marca,
  Producto,
  Almacen,
  Stock,
  MovimientoInventario,
  Proveedor,
  Compra,
  DetalleCompra,
  Venta,
  MetodoPago,
  DetalleVentaProducto,
  DetalleVentaServicio,
  Pago,
  Caja,
  PagoQrLibelula,
  AperturaCaja,
  CierreCaja,
  MovimientoCaja,
  PageVisit,
  InventarioLote,
  InventarioLoteMovimiento,
  Traspaso,
  TraspasoDetalle
  
};