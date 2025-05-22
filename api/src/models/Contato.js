// api/src/models/Contato.js

import mongoose from 'mongoose';

// Define o esquema do Mongoose para o modelo de Contato
const contatoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true // Remove espaços em branco do início e fim
  },
  cpf: {
    type: String,
    required: true,
    unique: true, // Garante que cada CPF seja único no banco de dados
    trim: true
  },
  tipo: {
    type: String,
    required: true,
    enum: ['Paciente', 'Dentista', 'Fornecedor'] // Limita os valores aceitos para o tipo
  },
  telefone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Garante que cada e-mail seja único
    trim: true,
    lowercase: true, // Converte o e-mail para minúsculas antes de salvar
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, insira um e-mail válido'] // Validação de formato de e-mail
  },
  endereco: {
    type: String,
    required: true,
    trim: true
  },
  fotoUrl: {
    type: String,
    default: '' // URL da imagem base64 da foto do rosto (opcional, pode ser vazio)
  },
  statusFinanceiro: {
    type: String,
    enum: ['Pago', 'Atrasado', 'Nao Pago', 'N/A'], // Status de pagamento do paciente
    default: 'N/A' // Valor padrão para o status financeiro
  },
  // Se você quiser vincular diretamente a anamnese ao contato, pode adicionar um campo aqui:
  // anamneseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Anamnese' }
}, {
  timestamps: true // Adiciona automaticamente campos createdAt e updatedAt
});

// Cria o modelo 'Contato' a partir do esquema
const Contato = mongoose.model('Contato', contatoSchema);

// Exporta o modelo como um export default para uso com ES Modules
export default Contato;
