// api/src/index.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; // Helper para __dirname em ESM

// Importa as rotas da aplicação
import authRoutes from './routes/auth.js';
import usuariosRoutes from './routes/usuarios.js';
import contatosRoutes from './routes/contatos.js';
import financeiroRoutes from './routes/financeiro.js'; // NOVO: Importa as rotas financeiras

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();

// --- Equivalente a __dirname em ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- Fim do equivalente a __dirname ---

// Configura o CORS para permitir requisições do frontend
app.use(cors({ origin: process.env.CLIENT_URL || 'https://odonto-marijara.onrender.com' }));
// Habilita o Express a parsear corpos de requisição JSON
app.use(express.json());

// Conecta ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  // As opções useNewUrlParser e useUnifiedTopology são amplamente depreciadas
  // em versões recentes do Mongoose e podem ser removidas.
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB conectado');
})
.catch((err) => {
  console.error('Erro ao conectar MongoDB:', err.message);
});

// Middleware para verificar a conexão com o banco de dados antes de processar rotas
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) { // 1 significa conectado
    return res.status(500).json({ message: 'Banco de dados não conectado. Por favor, tente novamente mais tarde.' });
  }
  next(); // Prossegue para a próxima middleware/rota
});

// Define as rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/contatos', contatosRoutes);
app.use('/api/financeiro', financeiroRoutes); // NOVO: Usa as rotas financeiras

// Serve arquivos estáticos do build do Vite (frontend)
// path.join(__dirname, '../../dist') resolve o caminho para a pasta 'dist'
app.use(express.static(path.join(__dirname, '../../dist')));

// Para qualquer outra requisição GET não tratada pelas rotas da API,
// serve o arquivo index.html do frontend. Isso é essencial para SPAs (Single Page Applications)
// para que o roteamento do lado do cliente funcione corretamente.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// Define a porta em que o servidor irá escutar (do ambiente ou padrão 3000)
const PORT = process.env.PORT || 3000;

// Inicia o servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
