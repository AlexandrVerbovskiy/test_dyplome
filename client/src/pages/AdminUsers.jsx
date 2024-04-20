import { useContext, useState } from "react";
import { usePagination } from "hooks";
import BaseAdminTableLayoutPage from "components/BaseAdminTableLayoutPage";
import {
  adminDeleteUser,
  adminUpdateUserAdmin,
  adminUpdateUserAuthorized,
  getFullUsers,
} from "requests";
import { MainContext } from "contexts";
import { CreateLink, SearchFilter, YesNoSpan } from "components";
import { Eye, Pencil, Plus, ChatText } from "react-bootstrap-icons";
import { generateFullUserImgPath } from "utils";

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
  profileAuthorized,
  nick,
  email,
  balance,
  admin,
  onDelete,
  authorizedChange,
  adminChange,
}) => {
  const main = useContext(MainContext);
  const isCurrentUser = main.sessionUser.id === id;

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
          active={profileAuthorized}
          onClick={isCurrentUser ? null : () => authorizedChange(id)}
        />
      </td>
      <td>
        <YesNoSpan
          active={admin}
          onClick={isCurrentUser ? null : () => adminChange(id)}
        />
      </td>
      <td>
        {!isCurrentUser && (
          <div className="fast-actions">
            <div className="cursor-pointer action-icon primary-action">
              <a href={`/users/${id}`}>
                <Eye size="20px" />
              </a>
            </div>
            <div className="cursor-pointer action-icon success-action">
              <a href={`/user-edit/${id}`}>
                <Pencil size="20px" />
              </a>
            </div>
            <div className="cursor-pointer action-icon secondary-action">
              <a href={`/system-chat/${id}`}>
                <ChatText size="20px" />
              </a>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
};

const DopFilterElem = ({ filter, changeFilter }) => (
  <div style={{ display: "flex", alignItems: "center", gridColumnGap: "10px" }}>
    <CreateLink link="user-create" />
    <SearchFilter filter={filter} changeFilter={changeFilter} />
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

  const onDelete = async (id) => {
    await main.request({
      url: adminDeleteUser.url(),
      data: adminDeleteUser.convertData(id),
      type: adminDeleteUser.type,
      convertRes: adminDeleteUser.convertRes,
    });

    rebuild();
  };

  const adminChange = async (id) => {
    const admin = await main.request({
      url: adminUpdateUserAdmin.url(),
      data: adminUpdateUserAdmin.convertData(id),
      type: adminUpdateUserAdmin.type,
      convertRes: adminUpdateUserAdmin.convertRes,
    });

    setItemFields({ admin }, id);
  };

  const authorizedChange = async (id) => {
    const authorized = await main.request({
      url: adminUpdateUserAuthorized.url(),
      data: adminUpdateUserAuthorized.convertData(id),
      type: adminUpdateUserAuthorized.type,
      convertRes: adminUpdateUserAuthorized.convertRes,
    });

    setItemFields({ profileAuthorized: authorized }, id);
  };

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
