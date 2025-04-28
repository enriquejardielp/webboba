const express = require('express');
const path = require('path');

const app = express();

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public'))); // Asume que tus archivos estáticos están en la carpeta 'public'

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
