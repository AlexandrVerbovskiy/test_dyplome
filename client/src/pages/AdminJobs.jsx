import { useContext } from "react";
import { usePagination } from "../hooks";
import BaseAdminTableLayoutPage from "../components/BaseAdminTableLayoutPage";
import { MainContext } from "../contexts";
import { getAllJobs } from "../requests";
import { Plus, Eye, Pencil } from "react-bootstrap-icons";

const headers = [
  {
    value: "id",
    title: "Id",
    width: "10%",
    canChange: true,
  },
  {
    value: "title",
    title: "Title",
    width: "25%",
    canChange: true,
  },
  {
    value: "users.email",
    title: "userEmail",
    width: "20%",
    canChange: true,
  },
  {
    value: "address",
    title: "Address",
    width: "20%",
    canChange: true,
  },
  {
    value: "price",
    title: "Price",
    width: "15%",
    canChange: true,
  },
  {
    value: "actions",
    title: "Actions",
    width: "10%",
  },
];

const JobRow = ({ userEmail, userId, id, title, price, address }) => {
  return (
    <tr>
      <td className="fw-bolder">#{id}</td>
      <td>
        <a href={`/jobs/${id}`}>{title}</a>
      </td>
      <td>
        <a href={`/users/${userId}`}>{userEmail}</a>
      </td>
      <td className="fw-bolder">${price}</td>
      <td>{address}</td>
      <td>
        <div className="fast-actions">
          <div className="cursor-pointer action-icon primary-action">
            <a href={`/job-view/${id}`}>
              <Eye size="20px" />
            </a>
          </div>
          <div className="cursor-pointer action-icon secondary-action">
            <a href={`/job-edit/${id}`}>
              <Pencil size="20px" />
            </a>
          </div>
        </div>
      </td>
    </tr>
  );
};

const DopFilterElem = ({ filter, changeFilter }) => (
  <div style={{ display: "flex", alignItems: "center", gridColumnGap: "10px" }}>
    <a
      className="btn btn-primary"
      href={`/job-create`}
      style={{ display: "flex", alignItems: "flex-end" }}
    >
      Create <Plus size="20px" />
    </a>
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

const AdminJobs = () => {
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
    items: jobs,
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
        url: getAllJobs.url(),
        data: getAllJobs.convertData(props),
        type: getAllJobs.type,
        convertRes: getAllJobs.convertRes,
      }),
  });

  return (
    <BaseAdminTableLayoutPage
      changeOrder={handleChangeOrder}
      order={order}
      orderType={orderType}
      items={jobs}
      title="Jobs"
      headers={headers}
      RowElem={JobRow}
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

export default AdminJobs;
