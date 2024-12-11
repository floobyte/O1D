// models/User.ts
import { Schema, model, models } from 'mongoose';
import { permission } from 'process';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  referralCode: {
    type: String,
    required: false,
  },
  referredBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  wallet: {
    type: Schema.Types.ObjectId,
    ref: 'Wallet',
    required: false,
  },
  
  role: {
    type: String,
    enum: ['admin','subadmin', 'user'],
    default: 'user',
  },

  permission: {
    type: [String],
    default:[]
  },

  assignedBy:{
    type: Schema.Types.ObjectId,
    ref:'User'
  },

  account: {
    type: Number,
    required: true
  },
  IFSC:{
    type: String,
    required: true
  },
  blocked: { 
    type: Boolean, 
    default: false 
  },
  resetToken: {
    type: String,    
  },
  resetTokenExpiry: {
   type: Date
  }
});

const User = models.User || model('User', UserSchema);
export default User;




// // models/User.ts
// import { Schema, model, models } from 'mongoose';

// const UserSchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   dob: {
//     type: Date,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   phone: {
//     type: Number,
//     required: true,
//     unique: true
//   },
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   referralCode: {
//     type: String,
//     required: false,
//   },
//   referredBy: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: false,
//   },
//   wallet: {
//     type: Schema.Types.ObjectId,
//     ref: 'Wallet',
//     required: false,
//   },
//   role: {
//     type: String,
//     enum: ['admin', 'user'],
//     default: 'user',
//   },
//   account: {
//     type: Number,
//     required: true
//   },
//   IFSC:{
//     type: String,
//     required: true
//   },
//   blocked: { 
//     type: Boolean, 
//     default: false 
//   },
//   resetToken: {
//     type: String,    
//   },
//   resetTokenExpiry: {
//    type: Date
//   }
// });

// const User = models.User || model('User', UserSchema);
// export default User;
