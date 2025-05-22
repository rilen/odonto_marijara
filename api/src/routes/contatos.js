// Import necessary modules using ES Modules syntax
import express from 'express';
const router = express.Router();

// Mock data (replace with MongoDB model later)
let contatos = [
  { id: 1, nome: 'João Silva', cpf: '123.456.789-00', tipo: 'Paciente', telefone: '(11) 99999-0000' },
  { id: 2, nome: 'Dr. Ana', cpf: '987.654.321-00', tipo: 'Dentista', telefone: '(11) 98888-1111' },
];

// GET all contacts
router.get('/', (req, res) => {
  res.json(contatos);
});

// POST a new contact
router.post('/', (req, res) => {
  const { nome, cpf, tipo, telefone } = req.body;
  // Basic validation
  if (!nome || !cpf || !telefone) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }
  const novoContato = { id: contatos.length + 1, nome, cpf, tipo, telefone };
  contatos.push(novoContato);
  res.json(novoContato);
});

// PUT (update) an existing contact by ID
router.put('/:id', (req, res) => {
  const { nome, cpf, tipo, telefone } = req.body;
  const id = parseInt(req.params.id); // Parse ID from URL parameter
  const index = contatos.findIndex((c) => c.id === id); // Find contact by ID

  if (index === -1) {
    return res.status(404).json({ message: 'Contato não encontrado.' });
  }
  contatos[index] = { id, nome, cpf, tipo, telefone }; // Update contact data
  res.json(contatos[index]);
});

// DELETE a contact by ID
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id); // Parse ID from URL parameter
  const index = contatos.findIndex((c) => c.id === id); // Find contact by ID

  if (index === -1) {
    return res.status(404).json({ message: 'Contato não encontrado.' });
  }
  contatos.splice(index, 1); // Remove contact from array
  res.json({ message: 'Contato excluído.' });
});

// Export the router as a default export for ES Modules
export default router;
