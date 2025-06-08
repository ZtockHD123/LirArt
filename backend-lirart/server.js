require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const verificarToken = require('./authMiddleware');

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

// --- ENDPOINTS DE AUTENTICACIÓN ---

app.post('/api/auth/register', async (req, res) => {
    const { nombreUsuario, rut, correo, region, comuna, contrasena } = req.body;
    try {
        const contrasenaHash = await bcrypt.hash(contrasena, 10);
        const query = `
            INSERT INTO usuarios(nombre_usuario, rut, correo, region, comuna, contrasena_hash)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING id, correo, nombre_usuario;
        `;
        const values = [nombreUsuario, rut, correo, region, comuna, contrasenaHash];
        const result = await db.query(query, values);
        res.status(201).json({ message: 'Usuario registrado exitosamente', user: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'El correo electrónico o el nombre de usuario ya existen.' });
        }
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) return res.status(400).json({ message: 'Correo y contraseña son requeridos.' });
    try {
        const result = await db.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
        if (result.rows.length === 0) return res.status(401).json({ message: 'Credenciales inválidas.' });
        const user = result.rows[0];
        const isPasswordCorrect = await bcrypt.compare(contrasena, user.contrasena_hash);
        if (!isPasswordCorrect) return res.status(401).json({ message: 'Credenciales inválidas.' });
        const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Inicio de sesión exitoso', token, user: { id: user.id, nombre_usuario: user.nombre_usuario, rol: user.rol } });
    } catch (error) {
    console.error('Error en el inicio de sesión:', error);

      // Devolvemos el error detallado a Postman para poder verlo
      res.status(500).json({
          message: 'Ocurrió un error en el servidor.',
          error_message: error.message, // El mensaje específico del error
          error_stack: error.stack      // La "pila de llamadas" que nos dice dónde ocurrió
      });
    }
});

// --- ENDPOINTS DE POSTS (CRUD) ---

app.post('/api/posts', verificarToken, async (req, res) => {
    const { texto, imagen_url } = req.body;
    const usuario_id = req.user.id;

    if (!imagen_url) {
        return res.status(400).json({ message: 'La URL de la imagen es requerida.' });
    }

    try {
        const query = `
            INSERT INTO posts(texto, imagen_url, usuario_id)
            VALUES($1, $2, $3)
            RETURNING *;
        `;
        const result = await db.query(query, [texto, imagen_url, usuario_id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la publicación.' });
    }
});

app.get('/api/posts', async (req, res) => {
    try {
        const query = `
            SELECT posts.*, usuarios.nombre_usuario FROM posts
            JOIN usuarios ON posts.usuario_id = usuarios.id
            ORDER BY posts.fecha_creacion DESC;
        `;
        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las publicaciones.' });
    }
});


// ... (resto de endpoints de Update y Delete)

// --- Iniciar Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor backend de LirArt escuchando en http://localhost:${PORT}`);
});