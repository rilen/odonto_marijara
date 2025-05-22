// api/src/models/User.js

import mongoose from 'mongoose'; // Usar import para mongoose

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'operador', 'dentista'] },
  modulos: [{ type: String }],
});

// Exportar o modelo Mongoose como um export default para ES Modules
const User = mongoose.model('User', userSchema);
export default User;
