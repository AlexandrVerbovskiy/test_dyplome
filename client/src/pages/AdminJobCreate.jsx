import React, { useContext, useState } from "react";

import { adminUpdateJob } from "requests";
import { MainContext } from "contexts";
import { AdminJobEditForm } from "components";

const AdminJobCreate = () => {
  const main = useContext(MainContext);
  const [baseData, setBaseData] = useState({});

  const onSave = async (formData) => {
    const hasId = !!baseData.id;

    if (hasId) {
      formData.append("jobId", baseData.id);
    }

    const job = await main.request({
      url: adminUpdateJob.url(),
      type: adminUpdateJob.type,
      convertRes: adminUpdateJob.convertRes,
      data: formData,
    });

    if (!hasId) {
      window.location.replace("/job-edit/" + job.id);
    }

    setBaseData(job);
  };

  return (
    <AdminJobEditForm
      baseData={baseData}
      onSave={onSave}
      hasId={!!baseData.id}
    />
  );
};

export default AdminJobCreate;
