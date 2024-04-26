import { getAllUsersPaymentTransactions } from "requests";
import { useContext } from "react";
import { usePagination } from "hooks";
import BaseAdminTableLayoutPage from "components/BaseAdminTableLayoutPage";
import { MainContext } from "contexts";

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
    width: "15%",
    canChange: true,
  },
  {
    value: "operation_type",
    title: "Status",
    width: "15%",
    canChange: true,
  },
  {
    value: "balance_change_type",
    title: "Type",
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
    width: "20%",
    canChange: true,
  },
];

const TransactionRow = ({
  id,
  money,
  operationType,
  balanceChangeType,
  createdAt,
  userName,
}) => {
  return (
    <tr>
      <td className="fw-bolder">#{id}</td>
      <td>{operationType}</td>
      <td className="fw-bolder">{userName}</td>
      <td>
        {balanceChangeType == "replenished" && (
          <span className="badge bg-gradient-quepal text-white shadow-sm w-100">
            Replenished
          </span>
        )}

        {balanceChangeType == "spent" && (
          <span className="badge bg-gradient-bloody text-white shadow-sm w-100">
            Spent
          </span>
        )}
      </td>
      <td>
        {balanceChangeType == "replenished" && (
          <span className="font-weight-bold text-success">+${money}</span>
        )}
        {balanceChangeType == "spent" && (
          <span className="font-weight-bold text-danger">-${money}</span>
        )}
      </td>
      <td className="fw-bolder">{createdAt}</td>
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
