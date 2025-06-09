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
    const { firstName, lastName, username, rut, email, regionId, comunaId, password } = req.body;

    if (!firstName || !lastName || !username || !rut || !email || regionId === undefined || comunaId === undefined || !password) {
        return res.status(400).json({ message: 'Todos los campos requeridos deben ser proporcionados para el registro.' });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO Users(
                first_name,
                last_name,
                username,
                email,
                password_hash,
                rut,
                region_id,
                comuna_id
                -- REMOVIDO: 'role' aquí, ya que tiene un valor por defecto en la BD
            )
            VALUES($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING user_id, username, email, first_name, last_name, role;
        `;
        const values = [
            firstName,
            lastName,
            username,
            email,
            passwordHash,
            rut,
            regionId,
            comunaId
            // No se añade el valor para 'role' aquí, ya que la BD usará el DEFAULT
        ];
        const result = await db.query(query, values);
        res.status(201).json({ message: 'Usuario registrado exitosamente', user: result.rows[0] });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        if (error.code === '23505') {
            let errorMessage = 'El correo electrónico, nombre de usuario o RUT ya existen.';
            if (error.detail.includes('email')) {
                errorMessage = 'El correo electrónico ya está registrado.';
            } else if (error.detail.includes('username')) {
                errorMessage = 'El nombre de usuario ya está en uso.';
            } else if (error.detail.includes('rut')) {
                errorMessage = 'El RUT ya está registrado.';
            }
            return res.status(409).json({ message: errorMessage });
        }
        res.status(500).json({ message: 'Error interno del servidor al registrar usuario.', error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) return res.status(400).json({ message: 'Correo y contraseña son requeridos.' });
    try {
        const result = await db.query('SELECT * FROM Users WHERE email = $1', [correo]);
        if (result.rows.length === 0) return res.status(401).json({ message: 'Credenciales inválidas.' });
        const user = result.rows[0];
        const isPasswordCorrect = await bcrypt.compare(contrasena, user.password_hash);
        if (!isPasswordCorrect) return res.status(401).json({ message: 'Credenciales inválidas.' });
        const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.user_id,
                username: user.username,
                role: user.role,
                firstName: user.first_name,
                lastName: user.last_name
            }
        });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({
            message: 'Ocurrió un error en el servidor.',
            error_message: error.message,
            error_stack: error.stack
        });
    }
});

// Este es el middleware de autenticación, no debe ser declarado dos veces en server.js
// La importación al inicio del archivo es suficiente.
// function verificarToken(req, res, next) { ... }

// --- ENDPOINTS DE POSTS (CRUD) ---

app.post('/api/posts', verificarToken, async (req, res) => {
    const { description, image_url } = req.body;
    const user_id = req.user.id; 

    if (!image_url) {
        return res.status(400).json({ message: 'La URL de la imagen es requerida.' });
    }

    try {
        const query = `
            INSERT INTO Posts(user_id, description, image_url)
            VALUES($1, $2, $3)
            RETURNING *;
        `;
        const result = await db.query(query, [user_id, description, image_url]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear la publicación:', error);
        res.status(500).json({ message: 'Error al crear la publicación.' });
    }
});

app.get('/api/posts', async (req, res) => {
    try {
        const query = `
            SELECT
                p.post_id,
                p.description,
                p.image_url,
                p.likes_count,
                p.comments_count,
                p.created_at,
                p.updated_at,
                u.user_id,
                u.username,
                u.profile_picture_url
            FROM Posts p
            JOIN Users u ON p.user_id = u.user_id
            ORDER BY p.created_at DESC;
        `;
        const result = await db.query(query);

        const formattedPosts = result.rows.map(row => ({
            id: row.post_id,
            user: {
                username: row.username,
                avatar: row.profile_picture_url || 'assets/img/default-avatar.png'
            },
            timestamp: new Date(row.created_at).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            text: row.description,
            imageUrl: row.image_url
        }));

        res.status(200).json(formattedPosts);
    } catch (error) {
        console.error('Error al obtener las publicaciones:', error);
        res.status(500).json({ message: 'Error al obtener las publicaciones.' });
    }
});


// --- Iniciar Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor backend de LirArt escuchando en http://localhost:${PORT}`);
});