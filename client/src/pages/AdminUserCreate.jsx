import React, { useContext, useState } from "react";

import { updateUser, createUser } from "../requests";
import { MainContext } from "../contexts";
import AdminUserEditForm from "../components/AdminUserEditForm";

const AdminUserEdit = () => {
  const main = useContext(MainContext);
  const [baseData, setBaseData] = useState({});

  const onSaveProfile = async (formData) => {
    const hasId = !!baseData.id;
    const request = hasId ? updateUser : createUser;

    if (hasId) {
      formData.append("userId", baseData.id);
    }

    const user = await main.request({
      url: request.url(),
      type: request.type,
      convertRes: request.convertRes,
      data: formData,
    });

    if (!hasId) {
      window.location.replace("/user-edit/" + user.id);
    }

    if (hasId) {
      main.setSuccess("User updated successfully")
    }else{
      main.setSuccess("User created successfully")
    }

    setBaseData(user);
  };

  return (
    <AdminUserEditForm
      baseData={baseData}
      onSave={onSaveProfile}
      hasId={!!baseData.id}
    />
  );
};

export default AdminUserEdit;
