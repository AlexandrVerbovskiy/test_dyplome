import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { MainContext } from "../contexts";
import { getJobDisputeInfo } from "../requests";
import { BaseJobEntityTemplate } from "../job_components";
import { Link } from "react-router-dom";

const AdminDispute = () => {
  let { disputeId } = useParams();
  const [dispute, setDispute] = useState(null);
  const { setSuccess, setError, request } = useContext(MainContext);

  useEffect(() => {
    (async () => {
      try {
        const res = await request({
          url: getJobDisputeInfo.url(disputeId),
          type: getJobDisputeInfo.type,
          convertRes: getJobDisputeInfo.convertRes,
        });

        setDispute({
          ...res,
        });
      } catch (e) {}
    })();
  }, [disputeId]);

  if (!dispute) return;

  return (
    <BaseJobEntityTemplate
      pageTitle="Proposal Info"
      jobTitle={dispute.title}
      jobLat={dispute.lat}
      jobLng={dispute.lng}
      proposalStatus={dispute.jobStatus}
      disputeStatus={dispute.status}
      jobAddress={dispute.address}
      jobDescription={dispute.jobDescription}
      proposalPrice={dispute.price}
      needShowAllStatus={true}
    >
      <hr />
      <div className="d-flex justify-content-end">
        {dispute.chatId && (
          <Link
            className="btn btn-primary"
            to={"/admin-client-chat-view/" + dispute.chatId}
          >
            View Chat
          </Link>
        )}
      </div>
    </BaseJobEntityTemplate>
  );
};

export default AdminDispute;
