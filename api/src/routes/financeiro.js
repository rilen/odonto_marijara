// api/src/routes/financeiro.js

import express from 'express';
// import Transaction from '../models/Transaction.js'; // Importe seu modelo de Transação se tiver um

const router = express.Router();

// Rota GET para buscar o status financeiro de um paciente
// Em uma aplicação real, esta rota consultaria seu banco de dados de transações/faturas
router.get('/status', async (req, res) => {
  const { pacienteId } = req.query; // Obtém o ID do paciente dos parâmetros da query

  if (!pacienteId) {
    return res.status(400).json({ message: 'ID do paciente é obrigatório.' });
  }

  // --- LÓGICA MOCKADA PARA DEMONSTRAÇÃO ---
  // Em um cenário real, você faria uma consulta ao banco de dados aqui.
  // Ex: const transactions = await Transaction.find({ paciente: pacienteId });
  // E então, com base nas transações, determinaria o status.

  const mockStatuses = {
    // IDs de exemplo de pacientes e seus status financeiros simulados
    '1': 'Pago',
    '2': 'Atrasado',
    '3': 'Nao Pago',
    '4': 'Pago',
    '5': 'Atrasado',
    // Adicione mais IDs e status para testar diferentes cenários
  };

  // Tenta obter o status do mock, se não encontrar, define como 'N/A'
  const status = mockStatuses[pacienteId] || 'N/A';

  // --- FIM DA LÓGICA MOCKADA ---

  res.json({ pacienteId, status }); // Retorna o ID do paciente e seu status financeiro
});

// Exporta o router para ser usado no arquivo principal da aplicação
export default router;
