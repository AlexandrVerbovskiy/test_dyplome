import { useContext } from "react";
import {
  useInitSearchDateFilter,
  usePagination,
  useSearchDateFilter,
} from "hooks";
import { MainContext } from "contexts";
import { getAllDisputes } from "requests";
import { Plus, Eye, Pencil } from "react-bootstrap-icons";
import { fullTimeFormat } from "utils";
import {
  CreateLink,
  DatePicker,
  SearchFilter,
  BaseAdminTableLayoutPage,
} from "components";

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
      <td>
        {status == "Resolved" && (
          <span className="badge bg-gradient-quepal text-white shadow-sm px-3">
            Resolved
          </span>
        )}

        {status == "Pending" && (
          <span className="badge bg-gradient-bloody text-white shadow-sm px-3">
            Pending
          </span>
        )}

        {status == "In Progress" && (
          <span className="badge bg-gradient-blooker text-white shadow-sm px-3">
            In Progress
          </span>
        )}
      </td>
      <td>{fullTimeFormat(createdAt)}</td>
      <td>
        <div className="fast-actions">
          <div className="cursor-pointer action-icon primary-action">
            <a href={`/dispute/${id}`}>
              <Eye size="20px" />
            </a>
          </div>
        </div>
      </td>
    </tr>
  );
};

const DopFilterElem = ({
  filter,
  changeFilter,
  fromDate,
  toDate,
  handleChangeDateFilter,
}) => (
  <div style={{ display: "flex", alignItems: "center", gridColumnGap: "10px" }}>
    <CreateLink link="dispute-create" />
    <DatePicker value={[fromDate, toDate]} onChange={handleChangeDateFilter} />
    <SearchFilter filter={filter} changeFilter={changeFilter} />
  </div>
);

const AdminDisputes = () => {
  const main = useContext(MainContext);

  const { fromDate, setFromDate, toDate, setToDate, getDateFilterProps } =
    useInitSearchDateFilter();

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
    getDopProps: () => ({
      ...getDateFilterProps(),
    }),
  });

  const { handleChangeDateFilter } = useSearchDateFilter({
    options,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    rebuild,
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
          fromDate,
          toDate,
          handleChangeDateFilter,
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
