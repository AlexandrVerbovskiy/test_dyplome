import { useContext } from "react";
import { usePagination } from "../hooks";
import BaseAdminTableLayoutPage from "../components/BaseAdminTableLayoutPage";
import { MainContext } from "../contexts";
import { getAllJobs, jobChangeActiveByAdmin } from "../requests";
import { Plus, Eye, Pencil } from "react-bootstrap-icons";
import { CreateLink, SearchFilter, YesNoSpan } from "../components";

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
    width: "15%",
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
    width: "10%",
    canChange: true,
  },
  {
    value: "active",
    title: "Active",
    width: "10%",
    canChange: false,
  },
  {
    value: "actions",
    title: "Actions",
    width: "10%",
  },
];

const JobRow = ({
  userEmail,
  userId,
  id,
  title,
  price,
  address,
  active,
  activeChange,
  processRequests,
}) => {
  console.log(processRequests);
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
        <YesNoSpan active={active} onClick={() => activeChange(id)} />
      </td>
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
    <CreateLink link="job-create" />
    <SearchFilter filter={filter} changeFilter={changeFilter} />
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

  const activeChange = async (id) => {
    const active = await main.request({
      url: jobChangeActiveByAdmin.url(),
      data: jobChangeActiveByAdmin.convertData(id),
      type: jobChangeActiveByAdmin.type,
      convertRes: jobChangeActiveByAdmin.convertRes,
    });

    setItemFields({ active }, id);
  };
  console.log(jobs);

  return (
    <BaseAdminTableLayoutPage
      changeOrder={handleChangeOrder}
      order={order}
      orderType={orderType}
      items={jobs}
      title="Jobs"
      headers={headers}
      RowElem={(data) => <JobRow activeChange={activeChange} {...data} />}
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
