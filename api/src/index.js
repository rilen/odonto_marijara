```
     const express = require('express');
     const mongoose = require('mongoose');
     const dotenv = require('dotenv');
     const cors = require('cors');
     const path = require('path');
     const authRoutes = require('./routes/auth');
     const usuariosRoutes = require('./routes/usuarios');
     const contatosRoutes = require('./routes/contatos');

     dotenv.config();
     const app = express();

     app.use(cors({ origin: process.env.CLIENT_URL || 'https://odonto-marijara.onrender.com' }));
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
     app.use('/api/contatos', contatosRoutes);

     // Servir arquivos estáticos do Vite
     app.use(express.static(path.join(__dirname, '../../dist')));
     app.get('*', (req, res) => {
       res.sendFile(path.join(__dirname, '../../dist/index.html'));
     });

     const PORT = process.env.PORT || 3000;
     app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
     ```
