const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
require('dotenv').config();

const initAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB conectado');

    const adminExists = await User.findOne({ email: 'admin@odonto.com' });
    if (adminExists) {
      console.log('Admin já existe:', adminExists.email);
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      email: 'admin@odonto.com',
      password: hashedPassword,
      role: 'admin',
      modulos: [
        'Dashboard', 'Contatos', 'Agendamento', 'Financeiro', 'Estoque', 'Relatorios',
        'Odontograma', 'Notificacoes', 'Configuracoes', 'Anamnese', 'Treinamento',
        'Suporte', 'Avaliacao', 'GestaoUsuarios',
      ],
    });
    console.log('Admin criado:', admin.email);
  } catch (err) {
    console.error('Erro:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

initAdmin();
