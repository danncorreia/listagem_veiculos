const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const veiculos = require('./veiculos.json');

// List all veiculos
app.get('/api/veiculos', (req, res) => {
  const page = parseInt(req.query.page ?? 0, 10);
  const size = parseInt(req.query.size ?? veiculos.length, 10);
  const start = page * size;
  const end = start + size;
  const data = veiculos.slice(start, end);
  setTimeout(() => {
    res.json({ data, total: veiculos.length });
  }, 1000 );
});

// Get one veiculo
app.get('/api/veiculos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const veiculo = veiculos.find(v => v.id === id);
  setTimeout(() => {
    if (veiculo) res.json(veiculo);
    else res.status(404).json({ message: 'Veículo não encontrado' });
  }, 1000);
});

// Create veiculo
app.post('/api/veiculos', (req, res) => {
  const newVeiculo = { id: veiculos.length + 1, ...req.body };
  veiculos.push(newVeiculo);
  setTimeout(() => {
    res.status(201).json(newVeiculo);
  }, 1000);
});

// Update veiculo
app.put('/api/veiculos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = veiculos.findIndex(v => v.id === id);
  setTimeout(() => {
    if (index !== -1) {
      veiculos[index] = { id, ...req.body };
      res.json(veiculos[index]);
    } else {
      res.status(404).json({ message: 'Veículo não encontrado' });
    }
  }, 1000);
});

// Delete veiculo
app.delete('/api/veiculos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = veiculos.findIndex(v => v.id === id);
  setTimeout(() => {
    if (index !== -1) {
      const deleted = veiculos.splice(index, 1);
      res.json(deleted[0]);
    } else {
      res.status(404).json({ message: 'Veículo não encontrado' });
    }
}, 1000);
});

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
