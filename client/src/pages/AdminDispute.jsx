import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { MainContext } from "../contexts";
import { getJobDisputeInfo } from "../requests";
import { BaseJobEntityTemplate } from "../job_components";

const AdminDispute = () => {
  let { disputeId } = useParams();
  const [dispute, setDispute] = useState(null);

  useEffect(() => {
    getJobDisputeInfo(
      disputeId,
      (res) => {
        setDispute({
          ...res,
        });
      },
      (err) => console.log(err)
    );
  }, [disputeId]);

  const { setSuccess, setError } = useContext(MainContext);

  if (!dispute) return;

  return (
    <BaseJobEntityTemplate
      pageTitle="Proposal Info"
      jobTitle={dispute.title}
      jobLat={dispute.lat}
      jobLng={dispute.lng}
      proposalStatus={dispute.job_status}
      disputeStatus={dispute.status}
      jobAddress={dispute.address}
      jobDescription={dispute.job_description}
      proposalPrice={dispute.price}
      needShowAllStatus={true}
    >
      <hr />
    </BaseJobEntityTemplate>
  );
};

export default AdminDispute;
