const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: 'Token no válido o expirado.' });
    }

    req.user = {
        id: decodedToken.id,
        role: decodedToken.role 
    }; 

    next();
  });
}

module.exports = verificarToken;