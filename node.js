const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer'); // Usado para enviar correos electrónicos

// Crear una aplicación Express
const app = express();

// Middleware para manejar JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conectar a MongoDB (usando Mongoose)
mongoose.connect('mongodb://localhost:27017/taxis', { useNewUrlParser: true, useUnifiedTopology: true });

// Definir un esquema de cliente
const clientSchema = new mongoose.Schema({
    name: String,
    location: String,
    destination: String,
    email: String,
    date: { type: Date, default: Date.now }
});

// Crear un modelo de cliente
const Client = mongoose.model('Client', clientSchema);

// Ruta para registrar un cliente
app.post('/send-taxi-request', (req, res) => {
    const { name, location, destination, email } = req.body;

    // Crear un nuevo cliente
    const newClient = new Client({ name, location, destination, email });

    // Guardar al cliente en la base de datos
    newClient.save((err, client) => {
        if (err) {
            res.status(500).send('Error al registrar el cliente.');
        } else {
            // Enviar un correo de confirmación
            sendTaxiRequestEmail(name, location, destination);
            res.status(200).json({ message: 'Cliente registrado exitosamente.' });
        }
    });
});

// Función para enviar el correo de confirmación
function sendTaxiRequestEmail(name, location, destination) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tuemail@gmail.com',
            pass: 'tuContraseña',
        },
    });

    const mailOptions = {
        from: 'tuemail@gmail.com',
        to: 'josereyes@yopmail.com',  // Correo al que se envía la solicitud
        subject: 'Nuevo pedido de taxi',
        html: `
            <p>El cliente <strong>${name}</strong> ha solicitado un taxi.</p>
            <p>Ubicación de recogida: ${location}</p>
            <p>Destino: ${destination}</p>
        `,
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
}

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});