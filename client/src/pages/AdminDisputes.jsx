import { useContext } from "react";
import { usePagination } from "../hooks";
import BaseAdminTableLayoutPage from "../components/BaseAdminTableLayoutPage";
import { MainContext } from "../contexts";
import { getAllDisputes } from "../requests";
import { Plus, Eye, Pencil } from "react-bootstrap-icons";
import { fullTimeFormat } from "../utils";
import { CreateLink, SearchFilter } from "../components";

const headers = [
  {
    value: "id",
    title: "Id",
    width: "10%",
    canChange: true,
  },
  {
    value: "jobs.title",
    title: "Job",
    width: "20%",
    canChange: true,
  },
  {
    value: "admins.email",
    title: "Admin",
    width: "10%",
    canChange: true,
  },
  {
    value: "senders.email",
    title: "Sender",
    width: "10%",
    canChange: true,
  },
  {
    value: "job_requests.price",
    title: "Price per hour",
    width: "10%",
    canChange: true,
  },
  {
    value: "job_requests.execution_time",
    title: "Need Hours",
    width: "10%",
    canChange: true,
  },
  {
    value: "status",
    title: "Status",
    width: "10%",
  },
  {
    value: "disputes.created_at",
    title: "createdAt",
    width: "10%",
    canChange: true,
  },
  {
    value: "actions",
    title: "Actions",
    width: "10%",
  },
];

const DisputeRow = ({
  id,
  adminEmail,
  createdAt,
  status,
  title,
  executionTime,
  price,
  jobRequestId,
  senderId,
  senderEmail,
  adminId,
}) => {
  return (
    <tr>
      <td className="fw-bolder">#{id}</td>
      <td>{title}</td>
      <td>
        <a href={`/users/${senderId}`}>{senderEmail}</a>
      </td>
      <td>
        {adminEmail ? <a href={`/users/${adminId}`}>{adminEmail}</a> : "-"}
      </td>
      <td>{price}</td>
      <td>{executionTime}</td>
      <td>{status}</td>
      <td>{fullTimeFormat(createdAt)}</td>
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
    <CreateLink link="dispute-create"/>
    <SearchFilter filter={filter} changeFilter={changeFilter} />
  </div>
);

const AdminDisputes = () => {
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
    items: disputes,
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
        url: getAllDisputes.url(),
        data: getAllDisputes.convertData(props),
        type: getAllDisputes.type,
        convertRes: getAllDisputes.convertRes,
      }),
  });

  return (
    <BaseAdminTableLayoutPage
      changeOrder={handleChangeOrder}
      order={order}
      orderType={orderType}
      items={disputes}
      title="Disputes"
      headers={headers}
      RowElem={DisputeRow}
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

export default AdminDisputes;
