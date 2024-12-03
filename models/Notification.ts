// models/Notification.ts
import { Schema, model, models } from 'mongoose';
const NotificationSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userRole: {
    type: String,
    ref: 'User'
    // required: true
  },
  transactionId: {
    type: Schema.Types.ObjectId,
    ref: 'WalletHistory'
  },
  withdrawalId: {
    type: Schema.Types.ObjectId,
    ref: 'WalletHistory'
  },
  message: {
    type: String,
    required: true

  },
  readStatus: {
    type: Boolean,
    default: false

  },
  createdAt: {
    type: Date,
    default: Date.now

  },
});

const Notification = models.Notification || model('Notification', NotificationSchema);

export default Notification;










// // models/Notification.ts
// import { Schema, model, models } from 'mongoose';



// const NotificationSchema: Schema = new Schema({
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   transactionId: {
//     type: Schema.Types.ObjectId,
//     ref: 'WalletHistory'
//    },
//   message: {
//     type: String,
//     required: true

//   },
//   readStatus: {
//     type: Boolean,
//     default: false

//   },
//   createdAt: {
//     type: Date,
//     default: Date.now

//   },
// });

// const Notification = models.Notification || model('Notification', NotificationSchema);

// export default Notification;
