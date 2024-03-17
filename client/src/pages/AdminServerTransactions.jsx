import { getServerTransactions } from "../requests";
import BaseTransactionsTable from "../components/BaseTransactionsTable";

const PaymentTransactions = () => (
  <BaseTransactionsTable
    listRequest={getServerTransactions}
    title="Server Transactions"
  />
);

export default PaymentTransactions;
