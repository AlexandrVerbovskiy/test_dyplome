import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { MainContext } from "contexts";
import {
  adminAssignDispute,
  disputeMarkEmployeeRight,
  disputeMarkWorkerRight,
  getJobDisputeInfo,
} from "requests";
import { Link } from "react-router-dom";
import { ViewInput, BaseJobEntityTemplate, YesNoPopup } from "components";
import CONFIG from "../config";

const AdminDispute = () => {
  let { disputeId } = useParams();
  const [dispute, setDispute] = useState(null);
  const { setSuccess, setError, request, sessionUser } =
    useContext(MainContext);
  const [workerRightPopupActive, setWorkerRightPopupActive] = useState(false);
  const [employeeRightPopupActive, setEmployeeRightPopupActive] =
    useState(false);

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

  const acceptEmployeeRight = async () => {
    await request({
      url: disputeMarkEmployeeRight.url(),
      type: disputeMarkEmployeeRight.type,
      convertRes: disputeMarkEmployeeRight.convertRes,
      data: disputeMarkEmployeeRight.convertData(dispute.id),
    });

    setDispute((prev) => ({
      ...prev,
      status: CONFIG.DISPUTE_STATUSES.resolved.value,
      rightUserId: sessionUser.jobAuthorId,
      proposalStatus: CONFIG.JOB_STATUSES.cancelled.value,
    }));

    setEmployeeRightPopupActive(false);
  };

  const acceptWorkerRight = async () => {
    await request({
      url: disputeMarkWorkerRight.url(),
      type: disputeMarkWorkerRight.type,
      convertRes: disputeMarkWorkerRight.convertRes,
      data: disputeMarkWorkerRight.convertData(dispute.id),
    });

    setDispute((prev) => ({
      ...prev,
      status: CONFIG.DISPUTE_STATUSES.resolved.value,
      rightUserId: sessionUser.workerId,
      proposalStatus: CONFIG.JOB_STATUSES.cancelled.value,
    }));

    setWorkerRightPopupActive(false);
  };

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
      <div className="d-flex justify-content-end flex-column flex-md-row">
        {!dispute.adminId && (
          <button
            onClick={handleAcceptDispute}
            type="button"
            className="btn btn-warning"
          >
            Fasten dispute by you
          </button>
        )}

        {dispute.adminId == sessionUser.id &&
          dispute.status != CONFIG.DISPUTE_STATUSES.resolved.value && (
            <>
              <button
                onClick={() => setEmployeeRightPopupActive(true)}
                className="btn btn-info mb-2 mb-md-0 me-md-2 w-100 w-md-auto"
              >
                Employee Right
              </button>
              <button
                onClick={() => setWorkerRightPopupActive(true)}
                className="btn btn-warning mb-2 mb-md-0 me-md-2 w-100 w-md-auto"
              >
                Worker Right
              </button>
            </>
          )}

        {dispute.chatId && (
          <Link
            className="btn btn-primary w-100 w-md-auto"
            to={"/admin-client-chat-view/" + dispute.chatId}
          >
            View Chat
          </Link>
        )}
      </div>

      <YesNoPopup
        shortTitle="Confirm that the worker is right in this dispute and the funds should go to him"
        trigger={workerRightPopupActive}
        onAccept={acceptWorkerRight}
        onClose={() => setWorkerRightPopupActive(false)}
        acceptText="Confirm"
        acceptType="success"
      />
      <YesNoPopup
        shortTitle="Confirm that the employee is right in this dispute and the funds should go back to him"
        trigger={employeeRightPopupActive}
        onAccept={acceptEmployeeRight}
        onClose={() => setEmployeeRightPopupActive(false)}
        acceptText="Confirm"
        acceptType="success"
      />
    </BaseJobEntityTemplate>
  );
};

export default AdminDispute;
