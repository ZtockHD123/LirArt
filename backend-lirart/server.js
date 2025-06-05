// Importar el módulo de express
const express = require('express');
// Crear una instancia de la aplicación express
const app = express();
// Definir el puerto donde escuchará el servidor
const PORT = process.env.PORT || 3000; // Puedes usar el puerto 3000, o cualquier otro disponible

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Ruta de prueba básica
app.get('/', (req, res) => {
  res.send('¡Servidor de LirArt funcionando!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend de LirArt escuchando en http://localhost:${PORT}`);
});
