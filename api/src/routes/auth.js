// api/src/routes/auth.js

import express from 'express'; // Usar import para express
import bcrypt from 'bcryptjs'; // Usar import para bcryptjs
import User from '../models/User.js'; // Usar import e .js para o modelo User
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'E-mail ou senha inválidos.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'E-mail ou senha inválidos.' });
    }
    res.json({ id: user._id, email: user.email, role: user.role, modulos: user.modulos });
  } catch (err) {
    console.error('Erro no servidor durante o login:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// Exportar o router como um export default para ES Modules
export default router;
