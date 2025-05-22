// api/src/routes/usuarios.js

import express from 'express'; // Usar import para express
import bcrypt from 'bcryptjs'; // Usar import para bcryptjs
import User from '../models/User.js'; // Usar import e .js para o modelo User
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclui a senha da resposta
    res.json(users);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

router.post('/', async (req, res) => {
  const { email, senha, role, modulos } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já cadastrado.' });
    }
    const hashedPassword = await bcrypt.hash(senha, 10); // Hash da senha
    const user = await User.create({ email, password: hashedPassword, role, modulos });
    res.status(201).json({ id: user._id, email: user.email, role: user.role, modulos: user.modulos });
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

router.put('/:id', async (req, res) => {
  const { email, senha, role, modulos } = req.body;
  try {
    const updateData = { email, role, modulos };
    if (senha) { // Se uma nova senha for fornecida, faça o hash
      updateData.password = await bcrypt.hash(senha, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json(user);
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json({ message: 'Usuário excluído.' });
  } catch (err) {
    console.error('Erro ao excluir usuário:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// Exportar o router como um export default para ES Modules
export default router;
