import AddFundForm from '@/app/components/wallet/AddFundForm';

export default function AddFundPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Add Funds</h1>
      <AddFundForm />
    </main>
  );
}
