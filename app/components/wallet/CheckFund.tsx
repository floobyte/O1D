import { motion } from "framer-motion";

type Wallet = {
  addFund: number;
  withdrawFund: number;
  checkFund: number;
  pendingWithdrawal: number;
};

export default function CheckFund({ wallet }: { wallet: Wallet }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="dark:bg-slate-950 mt-6 p-5 sm:dark:border sm:dark:border-neutral-400 rounded-md sm:shadow-xl w-full sm:w-[30rem] mx-auto flex flex-col items-center gap-4 bg-primary-foreground/25"
    >
      <h2 className="text-lg font-semibold text-center sm:text-left">Funds</h2>
      <div className="space-y-4 text-white w-full sm:w-4/5">
        <div className="flex justify-between">
          <span className="font-medium">Added Funds</span>
          <span className="text-green-600">₹{wallet.addFund.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Withdrawn Funds</span>
          <span className="text-red-600">₹{wallet.withdrawFund.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Available Funds</span>
          <span className="text-indigo-500">₹{wallet.checkFund.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Pending Withdrawal</span>
          <span className="text-yellow-600">₹{wallet.pendingWithdrawal.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
}
