```
       const express = require('express');
       const router = express.Router();

       // Mock data (replace with MongoDB model later)
       let contatos = [
         { id: 1, nome: 'João Silva', cpf: '123.456.789-00', tipo: 'Paciente', telefone: '(11) 99999-0000' },
         { id: 2, nome: 'Dr. Ana', cpf: '987.654.321-00', tipo: 'Dentista', telefone: '(11) 98888-1111' },
       ];

       router.get('/', (req, res) => {
         res.json(contatos);
       });

       router.post('/', (req, res) => {
         const { nome, cpf, tipo, telefone } = req.body;
         if (!nome || !cpf || !telefone) {
           return res.status(400).json({ message: 'Preencha todos os campos.' });
         }
         const novoContato = { id: contatos.length + 1, nome, cpf, tipo, telefone };
         contatos.push(novoContato);
         res.json(novoContato);
       });

       router.put('/:id', (req, res) => {
         const { nome, cpf, tipo, telefone } = req.body;
         const id = parseInt(req.params.id);
         const index = contatos.findIndex((c) => c.id === id);
         if (index === -1) {
           return res.status(404).json({ message: 'Contato não encontrado.' });
         }
         contatos[index] = { id, nome, cpf, tipo, telefone };
         res.json(contatos[index]);
       });

       router.delete('/:id', (req, res) => {
         const id = parseInt(req.params.id);
         const index = contatos.findIndex((c) => c.id === id);
         if (index === -1) {
           return res.status(404).json({ message: 'Contato não encontrado.' });
         }
         contatos.splice(index, 1);
         res.json({ message: 'Contato excluído.' });
       });

       module.exports = router;
       ```
