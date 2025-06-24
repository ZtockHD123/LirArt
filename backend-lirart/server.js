require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const verificarToken = require('./authMiddleware');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:8100',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
if (!accessToken) {
    console.error('ERROR: MERCADO_PAGO_ACCESS_TOKEN no está definido en el archivo .env');
}

const client = new MercadoPagoConfig({ accessToken: accessToken });
const preferenceInstance = new Preference(client);

app.post('/api/create-preference', async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            console.error('Error 400: Se espera un array de ítems válido en el cuerpo de la solicitud.');
            return res.status(400).json({ message: 'Se espera un array de ítems válido en el cuerpo de la solicitud.' });
        }

        for (const item of items) {
            if (!item.title || typeof item.unit_price !== 'number' || typeof item.quantity !== 'number' || item.quantity <= 0) {
                console.error('Error 400: Cada ítem debe tener title (string), unit_price (number) y quantity (number > 0).', item);
                return res.status(400).json({ message: 'Cada ítem debe tener title (string), unit_price (number) y quantity (number > 0).' });
            }
        }

        let preferenceConfig = {
            items: items.map(item => ({
                title: item.title,
                unit_price: Number(item.unit_price),
                quantity: Number(item.quantity),
            })),
            back_urls: {
                success: 'http://localhost:8100/pago-exitoso',
                failure: 'http://localhost:8100/pago-fallido',
                pending: 'http://localhost:8100/pago-pendiente',
            },
        };

        const response = await preferenceInstance.create({ body: preferenceConfig });

        res.status(200).json({ init_point: response.sandbox_init_point});

    } catch (error) {
        console.error('Error detallado al crear la preferencia de pago:', error.message);
        if (error.cause && error.cause.response && error.cause.response.data) {
            console.error('Detalles del error de Mercado Pago:', error.cause.response.data);
            return res.status(500).json({
                message: 'Error al procesar el pago con Mercado Pago.',
                details: error.cause.response.data
            });
        }
        res.status(500).json({ message: 'Error interno del servidor al crear la preferencia de pago.', error: error.message });
    }
});

app.post('/webhook-mp', (req, res) => {
    console.log('Webhook de Mercado Pago recibido:', req.query);
    console.log('Datos del webhook:', req.body);
    res.status(200).send('OK');
});

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
                lastName: user.last_name,
                email: user.email,
                rut: user.rut,
                regionId: user.region_id,
                comunaId: user.comuna_id
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
        const values = [user_id, description, image_url];
        const result = await db.query(query, values);
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

// --- NUEVOS ENDPOINTS PARA GESTIÓN DE PERFIL ---

app.get('/api/user/profile', verificarToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await db.query(
            'SELECT user_id, first_name, last_name, username, email, rut, region_id, comuna_id, role FROM Users WHERE user_id = $1',
            [userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el perfil.' });
    }
});

app.put('/api/user/profile', verificarToken, async (req, res) => {
    const { firstName, lastName, username, email, rut, regionId, comunaId, newPassword } = req.body;
    const userId = req.user.id;

    if (!firstName || !lastName || !username || !email || !rut || regionId === undefined || comunaId === undefined) {
        return res.status(400).json({ message: 'Todos los campos requeridos para la actualización deben ser proporcionados.' });
    }

    try {
        let updateQuery = `
            UPDATE Users
            SET
                first_name = $1,
                last_name = $2,
                username = $3,
                email = $4,
                rut = $5,
                region_id = $6,
                comuna_id = $7,
                updated_at = NOW()
        `;
        let updateValues = [firstName, lastName, username, email, rut, regionId, comunaId];
        let paramIndex = updateValues.length + 1;

        if (newPassword) {
            const passwordHash = await bcrypt.hash(newPassword, 10);
            updateQuery += `, password_hash = $${paramIndex}`;
            updateValues.push(passwordHash);
            paramIndex++;
        }

        updateQuery += ` WHERE user_id = $${paramIndex} RETURNING user_id, first_name, last_name, username, email, rut, region_id, comuna_id, role;`;
        updateValues.push(userId);

        const result = await db.query(updateQuery, updateValues);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado para actualizar.' });
        }
        res.status(200).json({ message: 'Perfil actualizado exitosamente', user: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar el perfil del usuario:', error);
        if (error.code === '23505') {
            let errorMessage = 'Error de duplicación de datos.';
            if (error.detail.includes('email')) {
                errorMessage = 'El correo electrónico ya está registrado por otro usuario.';
            } else if (error.detail.includes('username')) {
                errorMessage = 'El nombre de usuario ya está en uso por otro usuario.';
            } else if (error.detail.includes('rut')) {
                errorMessage = 'El RUT ya está registrado por otro usuario.';
            }
            return res.status(409).json({ message: errorMessage });
        }
        res.status(500).json({ message: 'Error interno del servidor al actualizar el perfil.', error: error.message });
    }
});

// Nuevo endpoint para eliminar la cuenta del usuario autenticado
app.delete('/api/user/profile', verificarToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await db.query('DELETE FROM Users WHERE user_id = $1', [userId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado para eliminar.' });
        }
        res.status(200).json({ message: 'Cuenta eliminada exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar la cuenta del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar la cuenta.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor backend de LirArt escuchando en http://localhost:${PORT}`);
});