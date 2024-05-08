import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { MainContext } from "contexts";
import {
  adminAssignDispute,
  disputeMarkEmployeeRight,
  disputeMarkWorkerRight,
  getJobDisputeInfo,
  adminUnassignDispute,
} from "requests";
import { Link } from "react-router-dom";
import { ViewInput, BaseJobEntityTemplate, YesNoPopup } from "components";
import CONFIG from "../config";
import { generateFullUserImgPath } from "utils";
import StarRatingView from "components/StarRatingView";

const UserCard = ({ user, ratingField }) => {
  const rating = user[ratingField] ?? {};

  return (
    <div className="row">
      <div className="col-12 d-flex justify-content-center align-items-center">
        <div style={{ width: "250px", height: "250px" }}>
          <img
            src={generateFullUserImgPath(user.avatar)}
            alt={user.email}
            height="100%"
            width="100%"
          />
        </div>
      </div>
      <div className="col-12 mt-4">
        <div className="row">
          <div className="col-12 d-flex">
            <label className="form-label form-label-view">Email: </label>
            <div className="input-group" style={{ marginLeft: "2px" }}>
              <a href={`/users/${user.id}`}>{user.email ?? "-"}</a>
            </div>
          </div>
          <div className="col-12 d-flex">
            <label className="form-label form-label-view">Nick: </label>
            <div className="input-group" style={{ marginLeft: "2px" }}>
              <a href={`/users/${user.id}`}>{user.nick ?? "-"}</a>
            </div>
          </div>
          <div className="col-12 d-flex align-items-center justify-content-center">
            <label className="form-label form-label-view mb-0">Rating: </label>
            <div className="input-group" style={{ marginLeft: "2px" }}>
              <StarRatingView value={rating.averageRating ?? 0} />
              <div
                style={{
                  marginTop: "15px",
                  fontSize: "12px",
                  lineHeight: "5px",
                }}
              >
                ({rating.totalComments ?? 0})
              </div>
            </div>
          </div>

          <div className="col-12 d-flex mt-2 justify-content-end">
            <a
              className="btn btn-info mb-2 mb-md-0 me-md-2 w-100 w-md-auto"
              href={`/system-chat/${user.id}`}
            >
              Send Message
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDispute = () => {
  let { disputeId } = useParams();
  const [dispute, setDispute] = useState(null);
  const [worker, setWorker] = useState(null);
  const [jobAuthor, setJobAuthor] = useState(null);

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
          ...res.dispute,
        });
        setJobAuthor({
          ...res.jobAuthor,
        });
        setWorker({
          ...res.worker,
        });

        console.log(res.jobAuthor);
        console.log(res.worker);
      } catch (e) {}
    })();
  }, [disputeId]);

  if (!dispute) return;

  const handleAcceptDispute = async () => {
    try {
      await request({
        url: adminAssignDispute.url(),
        type: adminAssignDispute.type,
        data: adminAssignDispute.convertData(disputeId),
        convertRes: adminAssignDispute.convertRes,
      });

      setDispute((prev) => ({ ...prev, adminId: sessionUser.id }));

      setSuccess(
        "Accepted success. Decide which of the users is right. Good luck"
      );
    } catch (e) {}
  };

  const handleUnacceptDispute = async () => {
    try {
      await request({
        url: adminUnassignDispute.url(),
        type: adminUnassignDispute.type,
        data: adminUnassignDispute.convertData(disputeId),
        convertRes: adminUnassignDispute.convertRes,
      });

      setDispute((prev) => ({ ...prev, adminId: null }));

      setSuccess(
        "Accepted success. Decide which of the users is right. Good luck"
      );
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

    setSuccess("Dispute resolved success. Good job");
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

    setSuccess("Dispute resolved success. Good job");
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
      proposalPrice={dispute.price * dispute.executionTime}
      needShowAllStatus={true}
      isProposal={true}
      pricePerHour={dispute.price}
      priceExecutionTime={dispute.executionTime}
    >
      <hr />
      <ViewInput
        label="Dispute description"
        className="view-job-description"
        value={dispute.description}
      />
      <hr />

      <div className="row">
        <div className="col-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h6 className="text-uppercase">Worker</h6>
              <hr />
              <UserCard user={worker} ratingField="workerRatingInfo" />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h6 className="text-uppercase">Job Author</h6>
              <hr />
              <UserCard user={jobAuthor} ratingField="employeeRatingInfo" />
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="d-flex justify-content-end flex-column flex-md-row">
        {!dispute.adminId && (
          <button
            onClick={handleAcceptDispute}
            type="button"
            className="btn btn-warning mb-2 mb-md-0 me-md-2 w-100 w-md-auto"
          >
            Assign me
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
              <button
                onClick={() => handleUnacceptDispute()}
                className="btn btn-danger mb-2 mb-md-0 me-md-2 w-100 w-md-auto"
              >
                Unassign me
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
