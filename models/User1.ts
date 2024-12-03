// models/User.ts
import { Schema, models, model } from 'mongoose';

const userSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 

  },
  password: { 
    type: String, 
    required: true 

  },
  role: { 
    type: String, 
    required: true, 
    enum: ['admin', 'user'], 
    default: 'user' 

  },
});

const User1 =  models.User1 || model('User1', userSchema);

export default User1;
