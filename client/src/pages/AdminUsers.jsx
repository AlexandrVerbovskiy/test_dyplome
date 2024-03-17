import { useContext, useState } from "react";
import { usePagination } from "../hooks";
import BaseAdminTableLayoutPage from "../components/BaseAdminTableLayoutPage";
import { getFullUsers } from "../requests";
import { MainContext } from "../contexts";
import { YesNoPopup, YesNoSpan } from "../components";
import { Eye, Pencil, Trash } from "react-bootstrap-icons";
import { generateFullUserImgPath } from "../utils";

const headers = [
  {
    value: "id",
    title: "Id",
    width: "10%",
    canChange: true,
  },
  {
    value: "avatar",
    title: "Avatar",
    width: "10%",
  },
  {
    value: "nick",
    title: "Nick",
    width: "20%",
    canChange: true,
  },
  {
    value: "email",
    title: "Email",
    width: "15%",
    canChange: true,
  },
  {
    value: "balance",
    title: "Balance",
    width: "15%",
    canChange: true,
  },
  {
    value: "authorized",
    title: "Authorized",
    width: "10%",
  },
  {
    value: "admin",
    title: "Admin",
    width: "10%",
  },
  {
    value: "actions",
    title: "Actions",
    width: "10%",
  },
];

const UserRow = ({
  id,
  avatar,
  profile_authorized,
  nick,
  email,
  balance,
  admin,
  onDelete,
  authorizedChange,
  adminChange,
}) => {
  const [activeDelete, setActiveDelete] = useState(false);
  return (
    <tr>
      <td className="fw-bolder">#{id}</td>
      <td>
        <div className="img-td">
          <img
            src={generateFullUserImgPath(avatar)}
            alt={email}
            height="100%"
            width="100%"
            className="base-img"
          />
        </div>
      </td>
      <td>{nick ?? "-"}</td>
      <td>
        <a href={`/users/${id}`}>{email}</a>
      </td>
      <td className="fw-bolder">${balance}</td>
      <td>
        <YesNoSpan
          active={profile_authorized}
          onClick={() => authorizedChange(id)}
        />
      </td>
      <td>
        <YesNoSpan active={admin} onClick={() => adminChange(id)} />
      </td>
      <td>
        <div className="fast-actions">
          <div className="cursor-pointer action-icon primary-action">
            <a href={`/user-view/${id}`}>
              <Eye size="20px" />
            </a>
          </div>
          <div className="cursor-pointer action-icon secondary-action">
            <a href={`/user-edit/${id}`}>
              <Pencil size="20px" />
            </a>
          </div>
          <div className="cursor-pointer action-icon danger-action">
            <Trash size="20px" onClick={() => setActiveDelete(true)} />
          </div>
          <YesNoPopup
            shortTitle="Delete User"
            title={`Are you sure you want to delete user ${email}`}
            trigger={activeDelete}
            onAccept={() => onDelete(id)}
            onClose={() => setActiveDelete(false)}
            acceptText="Delete"
          />
        </div>
      </td>
    </tr>
  );
};

const DopFilterElem = ({ filter, changeFilter }) => (
  <div>
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

const AdminUsers = () => {
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
    items: users,
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
        url: getFullUsers.url(),
        data: getFullUsers.convertData(props),
        type: getFullUsers.type,
        convertRes: getFullUsers.convertRes,
      }),
  });

  const onDelete = (id) => console.log(id);
  const adminChange = (id) => console.log(id);
  const authorizedChange = (id) => console.log(id);

  return (
    <BaseAdminTableLayoutPage
      changeOrder={handleChangeOrder}
      order={order}
      orderType={orderType}
      items={users}
      title="Users"
      headers={headers}
      RowElem={(props) =>
        UserRow({ ...props, onDelete, adminChange, authorizedChange })
      }
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

export default AdminUsers;
