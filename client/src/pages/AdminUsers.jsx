import { useState } from "react";
import { usePagination } from "../hooks";
import BaseAdminTableLayoutPage from "../components/BaseAdminTableLayoutPage";

const UserRow = ({}) => {};

const AdminUsers = () => {
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
    rebuild: onChangeOptions,
    setItemFields,
    options,
  } = usePagination({});

  return (
    <BaseAdminTableLayoutPage
      changeOrder={handleChangeOrder}
      order={order}
      orderType={orderType}
      items={users}
      title="Users"
      headers={headers}
      RowElem={UserRow}
    />
  );
};

export default AdminUsers;
