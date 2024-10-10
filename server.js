// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.get('/clientes', (req, res) => {
  const sql = 'SELECT * FROM clientes';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener clientes:', err);
      return res.status(500).send('Error en el servidor');
    }
    res.json(results);
  });
});

// Ruta para crear un cliente
app.post('/clientes', (req, res) => {
  const { nombre, email, telefono, direccion, cliente_idcard } = req.body;
  db.query(
    'INSERT INTO clientes (nombre, email, telefono, direccion, cliente_idcard) VALUES (?, ?, ?, ?, ?)', 
    [nombre, email, telefono, direccion, cliente_idcard], 
    (err, results) => {
      if (err) {
        console.error('Error al agregar cliente:', err);
        return res.status(500).send('Error al agregar cliente');
      }
      res.status(201).json({ id: results.insertId });
  });
});

// Ruta para actualizar un cliente
app.put('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono, direccion, cliente_idcard } = req.body;

  db.query('UPDATE clientes SET nombre = ?, email = ?, telefono = ?, direccion = ?, cliente_idcard = ? WHERE id = ?', 
    [nombre, email, telefono, direccion, cliente_idcard, id], 
    (err, results) => {
      if (err) {
        console.error('Error al actualizar cliente:', err);
        return res.status(500).send('Error al actualizar cliente');
      }
      if (results.affectedRows === 0) {
        return res.status(404).send('Cliente no encontrado');
      }
      res.status(200).json({ message: 'Cliente actualizado' });
  });
});

// Ruta para eliminar un cliente
app.delete('/clientes/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM clientes WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar cliente:', err);
      return res.status(500).send('Error al eliminar cliente');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Cliente no encontrado');
    }
    res.status(200).json({ message: 'Cliente eliminado' });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
