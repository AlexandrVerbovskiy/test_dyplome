import { getAllUsersPaymentTransactions } from "requests";
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
    value: "users.email",
    title: "User",
    width: "25%",
    canChange: true,
  },
  {
    value: "operation_type",
    title: "Operation Type",
    width: "15%",
    canChange: true,
  },
  {
    value: "money",
    title: "Money",
    width: "20%",
  },
  {
    value: "created_at",
    title: "Date",
    width: "25%",
    canChange: true,
  },
];

const TransactionRow = ({
  id,
  money,
  operationType,
  balanceChangeType,
  createdAt,
  userNick,
  userEmail,
}) => {
  return (
    <tr>
      <td className="fw-bolder">#{id}</td>
      <td className="fw-bolder">{userNick ?? userEmail}</td>
      <td className="ignore-response">
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

        {operationType == "done_job_offer" && (
          <span className="badge bg-gradient-bloody text-white shadow-sm px-3">
            Finished Offer
          </span>
        )}

        {operationType == "withdrawal_for_job_offer" && (
          <span className="badge bg-gradient-bloody text-white shadow-sm px-3">
            Withdrawal for Job Offer{" "}
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
        url: getAllUsersPaymentTransactions.url(),
        data: getAllUsersPaymentTransactions.convertData(props),
        type: getAllUsersPaymentTransactions.type,
        convertRes: getAllUsersPaymentTransactions.convertRes,
      }),
  });

  console.log(transactions);

  return (
    <BaseAdminTableLayoutPage
      changeOrder={handleChangeOrder}
      order={order}
      orderType={orderType}
      items={transactions}
      title="Users Transactions"
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
