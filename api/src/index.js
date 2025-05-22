// Import necessary modules using ES Modules syntax
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; // Helper for __dirname in ESM

// Import route modules (assuming they are also converted to ES Modules)
import authRoutes from './routes/auth.js'; // Note: .js extension is often required for ESM
import usuariosRoutes from './routes/usuarios.js';
import contatosRoutes from './routes/contatos.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// --- ESM equivalent of __dirname ---
// fileURLToPath converts a file:// URL to a path string
// import.meta.url gives the URL of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- End ESM __dirname equivalent ---

// Enable CORS for specified origin or a fallback
app.use(cors({ origin: process.env.CLIENT_URL || 'https://odonto-marijara.onrender.com' }));
// Parse JSON request bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  // These options are largely deprecated in recent Mongoose versions,
  // but included for compatibility if using an older version.
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB conectado');
})
.catch((err) => {
  console.error('Erro ao conectar MongoDB:', err.message);
});

// Middleware to check database connection status
app.use((req, res, next) => {
  // Mongoose connection states:
  // 0 = disconnected
  // 1 = connected
  // 2 = connecting
  // 3 = disconnecting
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ message: 'Banco de dados não conectado.' });
  }
  next(); // Proceed to the next middleware/route handler
});

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/contatos', contatosRoutes);

// Serve static files from the 'dist' directory (Vite build output)
// path.join(__dirname, '../../dist') correctly resolves the path relative to this file
app.use(express.static(path.join(__dirname, '../../dist')));

// For any other GET request, serve the main index.html file
// This is crucial for single-page applications (SPAs) to handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// Define the port to listen on, using environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`)); // Corrected: using backticks for template literal

