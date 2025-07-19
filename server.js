const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2/promise');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');

const app = express();
const port = 3000;

// Configuración de sesión
app.use(session({
    secret: 'tu_secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de conexión a la base de datos MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crowdfunding',
    port: 3306
});

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'knb.dev.88@gmail.com',
        pass: 'jfhkvyazigscgwfd' // Asegúrate de que esta sea la contraseña de aplicación correcta
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Middleware de depuración para verificar la sesión
app.use((req, res, next) => {
    console.log('Session userId:', req.session.userId); // Para depurar
    next();
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para obtener recompensas
app.get('/rewards', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM rewards');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener recompensas:', error);
        res.status(500).send('Error al obtener recompensas');
    }
});

// Enviar mensajes por correo electrónico
app.post('/submit-mentes-maestras', async (req, res) => {
    const { name, email, message } = req.body;

    let mailOptions = {
        from: 'knb.dev.88@gmail.com',
        to: 'knb.dev.88@gmail.com',
        subject: `Nuevo mensaje de ${name}`,
        text: message
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send('Mensaje enviado con éxito');
    } catch (error) {
        console.log('Error al enviar el mensaje:', error);
        res.status(500).send('Error al enviar el mensaje');
    }
});

// Ruta para registrar un usuario
app.post('/register',
    // Validaciones
    body('name').notEmpty().withMessage('Nombre es requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/\d/).withMessage('La contraseña debe tener al menos un número')
        .matches(/[A-Z]/).withMessage('La contraseña debe tener al menos una mayúscula'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        const verificationToken = crypto.randomBytes(32).toString('hex');

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const [result] = await pool.query('INSERT INTO users (name, email, password_hash, verified) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, 0]);

            // Enviar email de verificación
            const verificationLink = `http://localhost:${port}/verify-email?token=${verificationToken}&email=${email}`;
            const mailOptions = {
                from: 'knb.dev.88@gmail.com',
                to: email,
                subject: 'Verificación de cuenta',
                text: `Hola ${name},\n\nPor favor, haz clic en el siguiente enlace para verificar tu cuenta: ${verificationLink}`
            };

            await transporter.sendMail(mailOptions);

            // Guardar el token de verificación en la base de datos
            await pool.query('UPDATE users SET verification_token = ? WHERE email = ?', [verificationToken, email]);

            res.status(201).send('Usuario registrado exitosamente. Revisa tu email para verificar tu cuenta.');
        } catch (error) {
            console.error('Error al registrar el usuario:', error.message);
            res.status(500).send(`Error al registrar el usuario: ${error.message}`);
        }
    }
);

// Ruta para verificar el email
app.get('/verify-email', async (req, res) => {
    const { token, email } = req.query;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND verification_token = ?', [email, token]);

        if (rows.length === 0) {
            return res.status(400).send('Enlace de verificación inválido o expirado.');
        }

        await pool.query('UPDATE users SET verified = 1, verification_token = NULL WHERE email = ?', [email]);

        res.send('Cuenta verificada exitosamente. Ya puedes iniciar sesión.');
    } catch (error) {
        console.error('Error al verificar el email:', error.message);
        res.status(500).send('Error al verificar el email');
    }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    const { loginEmail, loginPassword } = req.body;
    console.log('Email recibido:', loginEmail);
    console.log('Password recibido:', loginPassword);

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [loginEmail]);
        console.log('Resultados de la consulta:', rows);

        if (rows.length === 0) {
            console.log('Email no encontrado');
            return res.status(401).send('Email o contraseña incorrectos');
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(loginPassword, user.password_hash);
        console.log('Comparación de contraseñas:', passwordMatch);

        if (!passwordMatch) {
            console.log('Contraseña incorrecta');
            return res.status(401).send('Email o contraseña incorrectos');
        }

        if (!user.verified) {
            console.log('Usuario no verificado');
            return res.status(401).send('Por favor, verifica tu email antes de iniciar sesión');
        }

        req.session.userId = user.id;
        const [rewards] = await pool.query('SELECT * FROM rewards');
        res.status(200).json({ message: 'Inicio de sesión exitoso', rewards });
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        res.status(500).send('Error al iniciar sesión');
    }
});



// Ruta para registrar una contribución
app.post('/contribute', async (req, res) => {
    const { rewardId, amount } = req.body;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).send('Usuario no autenticado');
    }

    try {
        // Verificar que la recompensa exista y obtener su cantidad actual
        const [reward] = await pool.query('SELECT * FROM rewards WHERE id = ?', [rewardId]);
        if (reward.length === 0) {
            return res.status(404).send('Recompensa no encontrada');
        }

        const currentQuantity = reward[0].quantity;
        if (currentQuantity < amount) {
            return res.status(400).send('No hay suficientes recompensas disponibles');
        }

        // Registrar la contribución
        await pool.query('INSERT INTO contributions (user_id, reward_id, amount) VALUES (?, ?, ?)', [userId, rewardId, amount]);
        
        // Disminuir la cantidad de recompensas disponibles
        await pool.query('UPDATE rewards SET quantity = quantity - ? WHERE id = ?', [amount, rewardId]);

        res.status(201).send('Contribución registrada exitosamente');
    } catch (error) {
        console.error('Error al registrar la contribución:', error.message);
        res.status(500).send('Error al registrar la contribución');
    }
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Ruta de prueba para enviar un correo
app.get('/send-test-email', async (req, res) => {
    let mailOptions = {
        from: 'knb.dev.88@gmail.com',
        to: 'knb.dev.88@gmail.com',
        subject: 'Correo de prueba',
        text: 'Este es un correo de prueba para verificar la configuración de nodemailer.'
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send('Correo de prueba enviado con éxito');
    } catch (error) {
        console.log('Error al enviar el correo de prueba:', error.message);
        res.status(500).send('Error al enviar el correo de prueba');
    }
});
