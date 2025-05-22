// Import necessary modules using ES Modules syntax
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'; // Ensure .js extension for local imports
const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    // Find all users and exclude their password from the response
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err); // Log the actual error for debugging
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// POST a new user (registration)
router.post('/', async (req, res) => {
  const { email, senha, role, modulos } = req.body;
  try {
    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já cadastrado.' });
    }
    // Hash the provided password before saving
    const hashedPassword = await bcrypt.hash(senha, 10);
    // Create the new user in the database
    const user = await User.create({ email, password: hashedPassword, role, modulos });
    // Respond with selected user details (excluding password)
    res.json({ id: user._id, email: user.email, role: user.role, modulos: user.modulos });
  } catch (err) {
    console.error('Error creating user:', err); // Log the actual error for debugging
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// PUT (update) an existing user by ID
router.put('/:id', async (req, res) => {
  const { email, senha, role, modulos } = req.body;
  try {
    const updateData = { email, role, modulos };
    // If a new password is provided, hash it before updating
    if (senha) {
      updateData.password = await bcrypt.hash(senha, 10);
    }
    // Find and update the user, returning the new document and excluding password
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error updating user:', err); // Log the actual error for debugging
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// DELETE a user by ID
router.delete('/:id', async (req, res) => {
  try {
    // Find and delete the user
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json({ message: 'Usuário excluído.' });
  } catch (err) {
    console.error('Error deleting user:', err); // Log the actual error for debugging
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// Export the router as a default export for ES Modules
export default router;
