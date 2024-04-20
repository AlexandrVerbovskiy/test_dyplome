import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { MainContext } from "../contexts";
import { adminAssignDispute, getJobDisputeInfo } from "../requests";
import { Link } from "react-router-dom";
import { ViewInput, BaseJobEntityTemplate } from "../components";

const AdminDispute = () => {
  let { disputeId } = useParams();
  const [dispute, setDispute] = useState(null);
  const { setSuccess, setError, request, sessionUser } =
    useContext(MainContext);

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

  const handleAcceptDispute = async (id) => {
    try {
      await request({
        url: adminAssignDispute.url(),
        type: adminAssignDispute.type,
        data: adminAssignDispute.convertData(id),
        convertRes: adminAssignDispute.convertRes,
      });

      setDispute((prev) => ({ ...prev, adminId: sessionUser.id }));
    } catch (e) {}
  };

  console.log(dispute);

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
      <ViewInput
        label="Dispute description"
        className="view-job-description"
        value={dispute.description}
      />
      <hr />
      <div className="d-flex justify-content-end">
        {!dispute.adminId && (
          <button
            onClick={handleAcceptDispute}
            type="button"
            className="btn btn-warning"
          >
            Fasten dispute by you
          </button>
        )}
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
