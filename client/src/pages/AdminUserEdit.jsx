import React, { useContext, useEffect, useState } from "react";

import { updateUser, getFullUserInfo } from "../requests";
import { MainContext } from "../contexts";
import { useParams } from "react-router-dom";
import AdminUserEditForm from "../components/AdminUserEditForm";

const AdminUserEdit = () => {
  const main = useContext(MainContext);
  const { id } = useParams();
  const [baseData, setBaseData] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const user = await main.request({
          url: getFullUserInfo.url(),
          type: getFullUserInfo.type,
          convertRes: getFullUserInfo.convertRes,
          data: getFullUserInfo.convertData(id),
        });
        setBaseData(user);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [id]);

  const onSaveProfile = async (formData) => {
    if (baseData.id) {
      formData.append("userId", baseData.id);
    }

    const user = await main.request({
      url: updateUser.url(),
      type: updateUser.type,
      convertRes: updateUser.convertRes,
      data: formData,
    });

    main.setSuccess("User updated successfully");
    setBaseData(user);
  };

  return (
    <AdminUserEditForm
      baseData={baseData}
      onSave={onSaveProfile}
      hasId={true}
    />
  );
};

export default AdminUserEdit;
