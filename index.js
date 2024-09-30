const express = require("express");
const app = express();

require('dotenv').config();

app.use(express.json());

const bookRouter = require('./routes/book.router');
const solicitudRouter = require('./routes/solicitud.router');

app.use("/api/v1/books", bookRouter);
app.use("/api/v1/solicitudes", solicitudRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('El servidor está funcionando correctamente');
});