import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    email: String
});

export const User = mongoose.model('User', userSchema);

class AuthService {
  constructor() {
    this.providers = [];
  }
}

const service = new AuthService();
export default service;
