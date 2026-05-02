// =============================================
// FILE: src/middleware/role_middleware.js
// =============================================

function allowRoles(...allowedRoles) {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          error: "Access denied. Admin only."
        });
      }

      next();

    } catch (err) {
      return res.status(403).json({
        error: "Unauthorized access"
      });
    }
  };
}

module.exports = {
  allowRoles
};