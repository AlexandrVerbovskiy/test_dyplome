import React, { useContext, useState } from "react";

import { adminUpdateJob, getJobInfo } from "../requests";
import { MainContext } from "../contexts";
import AdminJobEditForm from "../components/AdminJobEditForm";

const AdminJobEdit = () => {
  const main = useContext(MainContext);
  const { id } = useParams();
  const [baseData, setBaseData] = useState({});

  const onSave = async (formData) => {
    formData.append("jobId", baseData.id);

    const job = await main.request({
      url: adminUpdateJob.url(),
      type: adminUpdateJob.type,
      convertRes: adminUpdateJob.convertRes,
      data: formData,
    });

    setBaseData(job);
  };

  return <AdminJobEditForm baseData={baseData} onSave={onSave} hasId={true} />;
};

export default AdminJobEdit;
