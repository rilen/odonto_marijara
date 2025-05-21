const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');

dotenv.config();
const app = express();

app.use(cors);
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB conectado');
}).catch((err) => {
  console.error('Erro ao conectar MongoDB:', err.message);
});

// Middleware para verificar conexão com o banco
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ message: 'Banco de dados não conectado.' });
  }
  next();
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Inicializar Admin padrão
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const initAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@odonto.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        email: 'admin@odonto.com',
        password: hashedPassword,
        role: 'admin',
        modulos: [
          'Dashboard', 'Contatos', 'Agendamento', 'Financeiro', 'Estoque', 'Relatorios',
          'Odontograma', 'Notificacoes', 'Configuracoes', 'Anamnese', 'Treinamento',
          'Suporte', 'Avaliacao', 'GestaoUsuarios',
        ],
      });
      console.log('Admin padrão criado.');
    }
  } catch (err) {
    console.error('Erro ao criar admin:', err.message);
  }
};
initAdmin();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
