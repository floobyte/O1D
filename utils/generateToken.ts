// app/utils/generateToken.ts
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || '1234';

export const generateToken = (role: string) => {
  return jwt.sign({ role }, SECRET_KEY, { expiresIn: '7d' });
};
