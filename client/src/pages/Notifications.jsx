import { useContext } from "react";
import { DatePicker, Layout, SearchFilter, Pagination } from "components";
import { MainContext } from "contexts";
import {
  useInitSearchDateFilter,
  usePagination,
  useSearchDateFilter,
} from "hooks";
import { getNotificationsPaginationVersion } from "requests";
import {
  fullTimeFormat,
  getNotificationIcon,
  getNotificationMainColor,
  shortTimeFormat,
} from "utils";

const Notifications = () => {
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
    items: notifications,
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
        url: getNotificationsPaginationVersion.url(),
        data: getNotificationsPaginationVersion.convertData(props),
        type: getNotificationsPaginationVersion.type,
        convertRes: getNotificationsPaginationVersion.convertRes,
      }),
    getDopProps: () => getDateFilterProps(),
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
    <Layout pageClassName="default-view-page">
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="text-uppercase mb-0">Notifications</h6>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gridColumnGap: "10px",
                }}
              >
                <DatePicker
                  value={[fromDate, toDate]}
                  onChange={handleChangeDateFilter}
                />
              </div>
            </div>

            <hr />

            <div className="main-notification-list d-flex">
              {notifications.map((notification) => {
                const { id, type, body, title, createdAt, link } = notification;
                const iconClass = getNotificationIcon(type);
                const mainNotificationColor = getNotificationMainColor(type);

                return (
                  <div
                    className={`main-notification card b-light-${mainNotificationColor} ${
                      link ? "cursor-pointer" : ""
                    }`}
                    key={id}
                    onClick={() =>
                      link ? (window.location.href = link) : null
                    }
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div
                          className={`d-flex widgets-icons-2 rounded-circle bx bg-light-${mainNotificationColor} text-${mainNotificationColor}`}
                          style={{ marginRight: "10px" }}
                        >
                          <i className={`notify ${iconClass}`}></i>
                        </div>
                        <div style={{ width: "calc(100% - 66px)" }}>
                          <h6 className="msg-name">
                            {title}
                            <span className="msg-time float-end">
                              {fullTimeFormat(createdAt)}
                            </span>
                          </h6>
                          <p
                            className="mb-0 font-13"
                            dangerouslySetInnerHTML={{ __html: body }}
                          ></p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {notifications.length > 0 && (
              <Pagination
                page={page}
                countPages={countPages}
                move={moveToPage}
                canNext={canMoveNextPage}
                canPrev={canMovePrevPage}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
