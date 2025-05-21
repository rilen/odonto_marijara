const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
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
    const hashedPassword = await bcrypt.hash(senha, 10);
    const user = await User.create({ email, password: hashedPassword, role, modulos });
    res.json({ id: user._id, email: user.email, role: user.role, modulos: user.modulos });
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

router.put('/:id', async (req, res) => {
  const { email, senha, role, modulos } = req.body;
  try {
    const updateData = { email, role, modulos };
    if (senha) {
      updateData.password = await bcrypt.hash(senha, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json(user);
  } catch (err) {
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
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

module.exports = router;
