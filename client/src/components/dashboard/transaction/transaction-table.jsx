import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { useGetTransactionsQuery } from "@/store/services/transaction";
import Loader from "@/components/loader/loader";
import { useSearchParams } from "react-router-dom";

const TransactionTable = () => {
  const [searchParams] = useSearchParams();
  const {
    data: transactionData,
    isLoading: transactionLoading,
    isError: transactionError,
  } = useGetTransactionsQuery({
    page: null,
    search: null,
  });
  if (transactionLoading) return <Loader />;

  return (
    <div className="container">
      <h4 className="mb-2 text-2xl uppercase font-semibold flex justify-center">
        Transaction
      </h4>
      <DataTable
        columns={columns}
        data={transactionError ? [] : transactionData?.data || []}
        totalCount={transactionData?.totalPage}
      />
    </div>
  );
};

export default TransactionTable;
