import ApproveWithdrawalForm from '@/app/components/wallet/ApproveFundForm';

export default function ApproveWithdrawalPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Approve Fund</h1>
      <ApproveWithdrawalForm />
    </main>
  );
}
