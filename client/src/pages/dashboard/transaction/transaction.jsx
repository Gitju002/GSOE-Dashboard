import TransactionTable from "@/components/dashboard/transaction/transaction-table";

const transaction = () => {
  return (
    <section className="min-h-screen flex justify-start items-center py-12 flex-col">
      <TransactionTable />
    </section>
  );
};

export default transaction;
