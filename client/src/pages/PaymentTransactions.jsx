import { getPaymentTransactions } from "requests";
import BaseTransactionsTable from "components/BaseTransactionsTable";

const PaymentTransactions = () => (
  <BaseTransactionsTable listRequest={getPaymentTransactions} title="Transactions" />
);

export default PaymentTransactions;
