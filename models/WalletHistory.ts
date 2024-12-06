import { Schema, model, models } from "mongoose";

const walletHistorySchema = new Schema({
    walletId: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
        // required: true

    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    transactionType: {
        type: String,
        required: true

    }, // e.g., 'add_funds', 'withdraw', 'daily_earning'
    amount: {
        type: Number,
        required: true

    },
    balanceAfterTransaction: {
        type: Number,
        required: true

    },
    transactionDate: {
        type: Date,
        default: Date.now
    },
    approvalStatus: { 
        type: String, 
        default: 'pending'
     } 
});

const WalletHistory = models.WalletHistory || model('WalletHistory', walletHistorySchema);
export default WalletHistory;