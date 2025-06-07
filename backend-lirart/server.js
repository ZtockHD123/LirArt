const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const db = require('./db');

app.use(express.json());

// --- ENDPOINTS DE LA API ---

// Endpoint para registrar un nuevo usuario
app.post('/api/auth/register', (req, res) => {
  const userData = req.body;
  console.log('Datos recibidos para el registro:', userData);
  res.status(201).json({
    message: 'Usuario registrado exitosamente (simulación)',
    userId: `user_${Math.floor(Math.random() * 1000)}`,
    user: userData
  });
});

// Endpoint para iniciar sesión
app.post('/api/auth/login', (req, res) => {
  const { correo, contrasena } = req.body;
  console.log(`Intento de inicio de sesión para el correo: ${correo}`);
  if (correo && contrasena) {
    res.status(200).json({
      message: 'Inicio de sesión exitoso (simulación)',
      token: 'este_es_un_token_jwt_de_ejemplo_muy_seguro_12345',
      user: { email: correo, nombre: 'Fabián' }
    });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas (simulación)' });
  }
});


// Ruta de prueba básica
app.get('/', (req, res) => {
  res.send('¡Servidor de LirArt funcionando!');
});

// Iniciar el servidor
app.listen(PORT, async () => {
  console.log(`Servidor backend de LirArt escuchando en http://localhost:${PORT}`);
  // Prueba de conexión a la BD
  try {
    const result = await db.query('SELECT NOW()');
    console.log('Conexión a la base de datos exitosa:', result.rows[0].now);
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
});