// models/Wallet.ts
import { Schema, model, models } from 'mongoose';

const WalletSchema = new Schema({

  // userId: { 
  //   type: Schema.Types.ObjectId, 
  //   ref: 'User', 
  //   required: true 
  // },
  addFund: {
    type: Number,
    default: 0,
  },
  withdrawFund: {
    type: Number,
    default: 0,
  },
  checkFund: {
    type: Number,
    default: 0,
    required: true,
  },
  pendingWithdrawal: {
    type: Number,
    default: 0,
    required: true,
  },
});

const Wallet = models.Wallet || model('Wallet', WalletSchema);
export default Wallet;













// import { Schema, model, models } from 'mongoose';

// const WalletSchema = new Schema({
//   addFund: {
//     type: Number,
//     default: 0,
//   },
//   withdrawFund: {
//     type: Number,
//     default: 0,
//   },
//   checkFund: {
//     type: Number,
//     default: 0,
//     required: true,
//   },
//   pendingWithDrawl: {
//     type: Number,
//     default: 0,
//     required: true,
//   }
// });

// const Wallet = models.Wallet || model('Wallet', WalletSchema);
// export default Wallet;
