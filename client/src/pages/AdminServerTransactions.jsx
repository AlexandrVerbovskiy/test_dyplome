import {
  getAllUsersPaymentTransactions,
  getServerTransactions,
} from "requests";
import { useContext } from "react";
import { usePagination } from "hooks";
import BaseAdminTableLayoutPage from "components/BaseAdminTableLayoutPage";
import { MainContext } from "contexts";
import { fullTimeFormat } from "utils";

const headers = [
  {
    value: "id",
    title: "Id",
    width: "15%",
    canChange: true,
  },
  {
    value: "operation_type",
    title: "Operation Type",
    width: "27.5%",
    canChange: true,
  },
  {
    value: "money",
    title: "Money",
    width: "27.5%",
  },
  {
    value: "created_at",
    title: "Date",
    width: "30%",
    canChange: true,
  },
];

const TransactionRow = ({
  id,
  money,
  operationType,
  balanceChangeType,
  createdAt,
}) => {
  return (
    <tr>
      <td className="fw-bolder">#{id}</td>
      <td>
        {operationType == "replenishment_by_stripe" && (
          <span className="badge bg-gradient-quepal text-white shadow-sm px-3">
            Replenishment by Stripe
          </span>
        )}

        {operationType == "replenishment_by_paypal" && (
          <span className="badge bg-gradient-quepal text-white shadow-sm px-3">
            Replenishment by Paypal
          </span>
        )}

        {operationType == "withdrawal_by_stripe" && (
          <span className="badge bg-gradient-bloody text-white shadow-sm px-3">
            Withdrawal by Stripe
          </span>
        )}

        {operationType == "withdrawal_by_paypal" && (
          <span className="badge bg-gradient-bloody text-white shadow-sm px-3">
            Withdrawal by Paypal
          </span>
        )}
      </td>
      <td>
        {balanceChangeType == "topped_up" && (
          <span className="font-weight-bold text-success">+${money}</span>
        )}
        {balanceChangeType == "reduced" && (
          <span className="font-weight-bold text-danger">-${money}</span>
        )}
      </td>
      <td className="fw-bolder">{fullTimeFormat(createdAt)}</td>
    </tr>
  );
};

const PaymentTransactions = () => {
  const main = useContext(MainContext);

  const {
    moveToPage,
    changeFilter,
    filter,
    order,
    orderType,
    handleChangeOrder,
    canMoveNextPage,
    canMovePrevPage,
    items: transactions,
    currentTo,
    currentFrom,
    page,
    countPages,
    countItems,
    rebuild,
    setItemFields,
    options,
  } = usePagination({
    getItemsFunc: (props) =>
      main.request({
        url: getServerTransactions.url(),
        data: getServerTransactions.convertData(props),
        type: getServerTransactions.type,
        convertRes: getServerTransactions.convertRes,
      }),
  });

  console.log(transactions);

  return (
    <BaseAdminTableLayoutPage
      changeOrder={handleChangeOrder}
      order={order}
      orderType={orderType}
      items={transactions}
      title="Server Transactions"
      headers={headers}
      RowElem={TransactionRow}
      paginationInfo={{
        page,
        countPages,
        moveToPage,
        canMoveNextPage,
        canMovePrevPage,
      }}
    />
  );
};

export default PaymentTransactions;
