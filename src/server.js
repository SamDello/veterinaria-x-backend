require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexion a MySQL exitosa.');
    console.log('Modelos cargados correctamente.');

    app.listen(PORT, () => {
      console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
  }
}

startServer();