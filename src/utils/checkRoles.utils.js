// middleware/roleChecker.js

const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    const { user } = req.session;
    if (!user) {
      return res.redirect('/');
    }

    // Comprobar si el usuario tiene uno de los roles requeridos
    const hasRole = requiredRoles.some(role => user.roles.includes(role));
    if (!hasRole) {
      return res.redirect('/');
    }
    next();
  };
};

module.exports = { checkRole };
