// app/wallet/request-withdrawal/page.tsx
import React from 'react';
import RequestWithdrawalForm from '../../components/wallet/RequestWithdrawalForm';

const RequestWithdrawalPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Request Withdrawal</h1>
      <RequestWithdrawalForm />
    </div>
  );
};

export default RequestWithdrawalPage;
