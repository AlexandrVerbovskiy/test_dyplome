import { useContext } from "react";
import { usePagination } from "../hooks";
import BaseAdminTableLayoutPage from "../components/BaseAdminTableLayoutPage";
import { MainContext } from "../contexts";
import { allGetMoneyRequests, getAllGetMoneyRequests } from "../requests";
import { Eye, Pencil } from "react-bootstrap-icons";
import { fullTimeFormat } from "../utils";

const headers = [
  {
    value: "id",
    title: "Id",
    width: "10%",
    canChange: true,
  },
  {
    value: "platform",
    title: "Platform",
    width: "10%",
    canChange: true,
  },
  {
    value: "money",
    title: "Money",
    width: "15%",
    canChange: true,
  },
  {
    value: "user",
    title: "User",
    width: "20%",
    canChange: true,
  },
  {
    value: "status",
    title: "Status",
    width: "15%",
  },
  {
    value: "created_at",
    title: "Sent At",
    width: "10%",
    canChange: true,
  },
  {
    value: "done_at",
    title: "Done At",
    width: "10%",
    canChange: true,
  },
  {
    value: "actions",
    title: "Actions",
    width: "10%",
  },
];

const RequestRow = ({
  money,
  platform,
  createdAt,
  userEmail,
  userNick,
  doneAt,
  status,
  userId,
  id,
}) => {
  return (
    <tr>
      <td className="fw-bolder">#{id}</td>
      <td className="fw-bolder">{platform}</td>
      <td className="fw-bolder">${money}</td>
      <td>{<a href={`/users/${userId}`}>{userNick ?? userEmail}</a>}</td>
      <td>
        {status == "success" && (
          <span className="badge bg-gradient-quepal text-white shadow-sm w-100">
            Success
          </span>
        )}

        {status == "in_process" && (
          <span className="badge bg-gradient-blooker text-white shadow-sm w-100">
            In process
          </span>
        )}

        {status == "error" && (
          <span className="badge bg-gradient-bloody text-white shadow-sm w-100">
            Failed
          </span>
        )}
      </td>
      <td>{fullTimeFormat(createdAt)}</td>
      <td>{doneAt ? fullTimeFormat(doneAt) : "-"}</td>
      <td>
        <div className="fast-actions">
          <div className="cursor-pointer action-icon primary-action">
            <a href={`/get-money-request/${id}`}>
              <Eye size="20px" />
            </a>
          </div>
        </div>
      </td>
    </tr>
  );
};

const DopFilterElem = ({ filter, changeFilter }) => (
  <div style={{ display: "flex", alignItems: "center", gridColumnGap: "10px" }}>
    <div className="input-group search-filter">
      <input
        type="text"
        className="form-control"
        placeholder="Search..."
        value={filter}
        onInput={(e) => changeFilter(e.target.value)}
      />
    </div>
  </div>
);

const AdminGetMoneyRequests = () => {
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
    items: requests,
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
        url: getAllGetMoneyRequests.url(),
        data: getAllGetMoneyRequests.convertData(props),
        type: getAllGetMoneyRequests.type,
        convertRes: getAllGetMoneyRequests.convertRes,
      }),
  });

  return (
    <BaseAdminTableLayoutPage
      changeOrder={handleChangeOrder}
      order={order}
      orderType={orderType}
      items={requests}
      title="Requests"
      headers={headers}
      RowElem={RequestRow}
      DopFilterElem={() =>
        DopFilterElem({
          filter,
          changeFilter,
        })
      }
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

export default AdminGetMoneyRequests;
