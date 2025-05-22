// Example: ./models/User.js (converted to ES Modules)
import mongoose from 'mongoose'; // Use import for mongoose

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'operador', 'dentista'] },
  modulos: [{ type: String }],
});

// Export the Mongoose model as a default export for ES Modules
const User = mongoose.model('User', userSchema);
export default User;
