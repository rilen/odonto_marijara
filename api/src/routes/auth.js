// Example: ./routes/auth.js (converted to ES Modules)
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'; // Ensure .js extension for local imports
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
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// Export the router as a default export for ES Modules
export default router;
