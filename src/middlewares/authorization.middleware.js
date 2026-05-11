function authorizePermissions(...requiredPermissions) {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          ok: false,
          message: 'Usuario no autenticado.',
        });
      }

      const userRoles = user.roles || [];
      const userPermissions = user.permisos || [];

      if (userRoles.includes('ADMINISTRADOR')) {
        return next();
      }

      const hasAllPermissions = requiredPermissions.every((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasAllPermissions) {
        return res.status(403).json({
          ok: false,
          message: 'No tiene permisos suficientes para realizar esta accion.',
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: 'Error al validar permisos.',
        error: error.message,
      });
    }
  };
}

function authorizeAnyPermission(...requiredPermissions) {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          ok: false,
          message: 'Usuario no autenticado.',
        });
      }

      const userRoles = user.roles || [];
      const userPermissions = user.permisos || [];

      if (userRoles.includes('ADMINISTRADOR')) {
        return next();
      }

      const hasAnyPermission = requiredPermissions.some((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasAnyPermission) {
        return res.status(403).json({
          ok: false,
          message: 'No tiene permisos suficientes para realizar esta accion.',
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: 'Error al validar permisos.',
        error: error.message,
      });
    }
  };
}

module.exports = {
  authorizePermissions,
  authorizeAnyPermission,
};