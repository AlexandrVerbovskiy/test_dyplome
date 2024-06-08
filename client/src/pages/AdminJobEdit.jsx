import React, { useContext, useEffect, useState } from "react";

import { adminUpdateJob, getJobInfo } from "requests";
import { MainContext } from "contexts";
import { AdminJobEditForm } from "components";
import { useParams } from "react-router-dom";

const AdminJobEdit = () => {
  const main = useContext(MainContext);
  const { id } = useParams();
  const [baseData, setBaseData] = useState({});

  const onSave = async (formData) => {
    try {
      formData.append("jobId", id);

      const job = await main.request({
        url: adminUpdateJob.url(),
        type: adminUpdateJob.type,
        convertRes: adminUpdateJob.convertRes,
        data: formData,
      });

      setBaseData(job);
    } catch (e) {}
  };

  const init = async () => {
    try {
      const job = await main.request({
        url: getJobInfo.url(id),
        type: getJobInfo.type,
        convertRes: getJobInfo.convertRes,
      });

      setBaseData(job);
    } catch (e) {}
  };

  useEffect(() => {
    init();
  }, [id]);

  return <AdminJobEditForm baseData={baseData} onSave={onSave} hasId={true} />;
};

export default AdminJobEdit;
