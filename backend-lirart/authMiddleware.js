const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => { // Renombrado 'user' a 'decodedToken' para mayor claridad
    if (err) {
      return res.status(403).json({ message: 'Token no válido o expirado.' }); // Mensaje más descriptivo
    }

 // CAMBIO CLAVE: Asignar user_id del token a req.user.id
 // y el rol del token a req.user.role
 // Asegúrate de que el payload del token en el login incluya 'id' y 'role'
    req.user = {
        id: decodedToken.id, // El 'id' en el token debería ser el 'user_id' de la BD
        role: decodedToken.role // El 'role' en el token
    }; 

    next();
  });
}

module.exports = verificarToken;