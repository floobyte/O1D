// app/wallet/approve-withdrawal/page.tsx
import React from 'react';
import ApproveWithdrawalForm from '../../components/wallet/ApproveWithdrawalForm';

const ApproveWithdrawalPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Approve Withdrawal</h1>
      <ApproveWithdrawalForm />
    </div>
  );
};

export default ApproveWithdrawalPage;
