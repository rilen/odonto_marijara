// api/src/routes/contatos.js

import express from 'express';
import Contato from '../models/Contato.js'; // Importa o modelo Contato

const router = express.Router();

// Rota GET para buscar todos os contatos
router.get('/', async (req, res) => {
  try {
    const contatos = await Contato.find(); // Busca todos os documentos da coleção Contato
    res.json(contatos); // Retorna os contatos como JSON
  } catch (err) {
    console.error('Erro ao buscar contatos:', err);
    res.status(500).json({ message: 'Erro no servidor ao buscar contatos.' });
  }
});

// Rota GET para buscar um único contato por ID
router.get('/:id', async (req, res) => {
  try {
    const contato = await Contato.findById(req.params.id); // Busca um contato pelo ID
    if (!contato) {
      return res.status(404).json({ message: 'Contato não encontrado.' });
    }
    res.json(contato); // Retorna o contato encontrado
  } catch (err) {
    console.error('Erro ao buscar contato por ID:', err);
    res.status(500).json({ message: 'Erro no servidor ao buscar contato.' });
  }
});

// Rota POST para adicionar um novo contato
router.post('/', async (req, res) => {
  // Desestrutura os novos campos do corpo da requisição
  const { nome, cpf, tipo, telefone, email, endereco, fotoUrl, statusFinanceiro } = req.body;

  // Validação básica dos campos obrigatórios
  if (!nome || !cpf || !telefone || !email || !endereco) {
    return res.status(400).json({ message: 'Todos os campos obrigatórios (Nome, CPF, Telefone, E-mail, Endereço) devem ser preenchidos.' });
  }

  try {
    // Cria um novo documento de Contato no banco de dados
    const novoContato = await Contato.create({
      nome,
      cpf,
      tipo,
      telefone,
      email,
      endereco,
      fotoUrl, // Inclui a URL da foto
      statusFinanceiro // Inclui o status financeiro inicial
    });
    res.status(201).json(novoContato); // Retorna o novo contato criado com status 201 (Created)
  } catch (err) {
    console.error('Erro ao cadastrar contato:', err);
    // Se o erro for de duplicidade (e-mail ou CPF), retorna uma mensagem específica
    if (err.code === 11000) { // Código de erro do MongoDB para duplicidade de chave única
      return res.status(400).json({ message: 'E-mail ou CPF já cadastrado.' });
    }
    res.status(500).json({ message: 'Erro no servidor ao cadastrar contato.' });
  }
});

// Rota PUT para atualizar um contato existente por ID
router.put('/:id', async (req, res) => {
  // Desestrutura os campos do corpo da requisição
  const { nome, cpf, tipo, telefone, email, endereco, fotoUrl, statusFinanceiro } = req.body;

  // Cria um objeto com os dados a serem atualizados
  const updateData = { nome, cpf, tipo, telefone, email, endereco, fotoUrl, statusFinanceiro };

  try {
    // Encontra e atualiza o contato pelo ID, retornando o documento atualizado
    const contatoAtualizado = await Contato.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } // 'new: true' retorna o documento atualizado; 'runValidators: true' executa as validações do esquema
    );

    if (!contatoAtualizado) {
      return res.status(404).json({ message: 'Contato não encontrado para atualização.' });
    }
    res.json(contatoAtualizado); // Retorna o contato atualizado
  } catch (err) {
    console.error('Erro ao atualizar contato:', err);
    // Se o erro for de duplicidade (e-mail ou CPF), retorna uma mensagem específica
    if (err.code === 11000) {
      return res.status(400).json({ message: 'E-mail ou CPF já cadastrado para outro contato.' });
    }
    res.status(500).json({ message: 'Erro no servidor ao atualizar contato.' });
  }
});

// Rota DELETE para excluir um contato por ID
router.delete('/:id', async (req, res) => {
  try {
    const contatoExcluido = await Contato.findByIdAndDelete(req.params.id); // Encontra e exclui o contato
    if (!contatoExcluido) {
      return res.status(404).json({ message: 'Contato não encontrado para exclusão.' });
    }
    res.json({ message: 'Contato excluído com sucesso.' }); // Retorna mensagem de sucesso
  } catch (err) {
    console.error('Erro ao excluir contato:', err);
    res.status(500).json({ message: 'Erro no servidor ao excluir contato.' });
  }
});

// Exporta o router para ser usado no arquivo principal da aplicação
export default router;
