import { useContext } from "react";
import { usePagination } from "hooks";
import BaseAdminTableLayoutPage from "./BaseAdminTableLayoutPage";
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
    title: "Status",
    width: "20%",
    canChange: true,
  },
  {
    value: "balance_change_type",
    title: "Type",
    width: "20%",
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
}) => {
  return (
    <tr>
      <td className="fw-bolder">#{id}</td>
      <td>{operationType}</td>
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
      <td className="fw-bolder">{fullTimeFormat(createdAt)}</td>
    </tr>
  );
};

const BaseTransactionsTable = ({ listRequest, title }) => {
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
        url: listRequest.url(),
        data: listRequest.convertData(props),
        type: listRequest.type,
        convertRes: listRequest.convertRes,
      }),
  });

  console.log(transactions);

  return (
    <BaseAdminTableLayoutPage
      changeOrder={handleChangeOrder}
      order={order}
      orderType={orderType}
      items={transactions}
      title={title}
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

export default BaseTransactionsTable;
