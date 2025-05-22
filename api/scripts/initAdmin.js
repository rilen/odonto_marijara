const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const initializeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB conectado');

    const adminEmail = 'admin@odonto.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = new User({
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        modulos: [
          'Dashboard', 'Contatos', 'Agendamento', 'Financeiro', 'Estoque', 'Relatorios',
          'Odontograma', 'Notificacoes', 'Configuracoes', 'Anamnese', 'Treinamento',
          'Suporte', 'Avaliacao', 'GestaoUsuarios'
        ],
      });
      await adminUser.save();
      console.log('Admin criado:', adminEmail);
    } else {
      console.log('Admin já existe:', adminEmail);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Erro ao inicializar Admin:', error);
    process.exit(1);
  }
};

initializeAdmin();
