import { useContext, useState } from "react";
import {
  useInitSearchDateFilter,
  usePagination,
  useSearchDateFilter,
} from "../hooks";
import BaseAdminTableLayoutPage from "../components/BaseAdminTableLayoutPage";
import { MainContext } from "../contexts";
import { getAllGetMoneyRequests } from "../requests";
import { Eye, Paypal, Stripe } from "react-bootstrap-icons";
import { fullTimeFormat, getQueryParams } from "../utils";
import { DatePicker, SearchFilter } from "../components";
import Select from "react-select";

const filterTypeOptions = [
  { value: "actual", label: "Actual" },
  { value: "done", label: "Done" },
  { value: "all", label: "All" },
];

const baseFilterType = filterTypeOptions[0]["value"];

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
      <td className="fw-bolder">
        {platform == "paypal" ? (
          <div className="d-flex align-items-center">
            <Paypal size={14} />
            <span className="ms-1 platform-name">PayPal</span>
          </div>
        ) : (
          <div className="d-flex align-items-center">
            <Stripe size={14} />
            <span className="ms-1 platform-name">Stripe</span>
          </div>
        )}
      </td>
      <td className="fw-bolder">${money}</td>
      <td>{<a href={`/users/${userId}`}>{userNick ?? userEmail}</a>}</td>
      <td>
        {status == "success" && (
          <span
            className="badge bg-gradient-quepal text-white shadow-sm"
            style={{ width: "90px" }}
          >
            Success
          </span>
        )}

        {status == "in_process" && (
          <span
            className="badge bg-gradient-blooker text-white shadow-sm"
            style={{ width: "90px" }}
          >
            In process
          </span>
        )}

        {status == "error" && (
          <span
            className="badge bg-gradient-bloody text-white shadow-sm"
            style={{ width: "90px" }}
          >
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

const DopFilterElem = ({
  filter,
  changeFilter,
  fromDate,
  toDate,
  handleChangeDateFilter,
  filterType,
  setFilterType,
}) => (
  <div style={{ display: "flex", alignItems: "center", gridColumnGap: "10px" }}>
    <DatePicker value={[fromDate, toDate]} onChange={handleChangeDateFilter} />
    <div className="input-group">
      <Select
        className="custom-search-select w-100"
        options={filterTypeOptions}
        value={filterTypeOptions.find((option) => option.value === filterType)}
        onChange={(event) => setFilterType(event.value)}
        isSearchable={false}
      />
    </div>

    <SearchFilter filter={filter} changeFilter={changeFilter} />
  </div>
);

const AdminGetMoneyRequests = () => {
  const main = useContext(MainContext);

  const { fromDate, setFromDate, toDate, setToDate, getDateFilterProps } =
    useInitSearchDateFilter();

  let { type: defaultFilterType } = getQueryParams();

  if (!defaultFilterType) {
    defaultFilterType = baseFilterType;
  }

  const [filterType, setFilterType] = useState(defaultFilterType);

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
    getDopProps: () => ({
      ...getDateFilterProps(),
      type: {
        value: filterType,
        hidden: (value) => value === "actual",
      },
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

  const handleChangeFilterType = (value) => {
    setFilterType(value);
    rebuild({ type: value });
  };

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
          fromDate,
          toDate,
          handleChangeDateFilter,
          filterType,
          setFilterType: handleChangeFilterType,
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
