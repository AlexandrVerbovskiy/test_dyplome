import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { MainContext } from "contexts";
import {
  MapMarker,
  Map,
  JobProposalForm,
  Layout,
  ViewInput,
  PopupWrapper,
  CommentCard,
} from "components";
import config from "config";
import { getJobInfo } from "requests";
import { usePopupController, useComments } from "hooks";

const jobType = config.COMMENT_TYPES.job;

const JobView = () => {
  let { id } = useParams();
  const [job, setJob] = useState(null);
  const main = useContext(MainContext);

  useEffect(() => {
    (async () => {
      try {
        const res = await main.request({
          url: getJobInfo.url(id),
          type: getJobInfo.type,
          convertRes: getJobInfo.convertRes,
        });

        if (!res) return;

        setJob(res);
      } catch (e) {}
    })();
  }, [id]);

  const { setSuccess, setError } = useContext(MainContext);
  const { jobProposalFormState } = usePopupController({
    onSuccess: setSuccess,
    onError: setError,
  });

  const {
    comments,
    totalCount,
    handleCreateComment,
    handleCreateReplyComment,
    handleGetMoreComments,
    handleGetMoreReplyComments,
  } = useComments({ entityId: id, type: jobType });

  if (!job) return;

  const onGetMoreCommentsClick = () => handleGetMoreComments();
  const onGetMoreReplyCommentsClick = (parentCommentId) => {
    handleGetMoreReplyComments(parentCommentId);
  };

  return (
    <Layout pageClassName="job-view-page">
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            <h6 className="text-uppercase">Job Info</h6>
            <hr />

            <div className="row">
              <div className="job-edit-map col-12 col-md-6">
                <Map>
                  <MapMarker title={job.title} lat={job.lat} lng={job.lng} />
                </Map>
              </div>

              <div className="col-12 col-md-6 job-edit-inputs">
                <ViewInput label="Job title" value={job.title} />
                <ViewInput label="Job total price" value={job.price} />
                <ViewInput label="Job address" value={job.address} />
                <ViewInput
                  label="Job description"
                  className="view-job-description"
                  value={job.description}
                />
              </div>
            </div>

            <hr />

            {!main.sessionUser.admin && main.sessionUser.id != job.authorId ? (
              <div className="d-flex align-items-center">
                <div className="dropdown job-proposal-statuses-change">
                  <div className="job-view-actions">
                    <a
                      href={"/chat/personal/" + job.authorId}
                      className="btn btn-primary w-100"
                    >
                      Write to author
                    </a>

                    <button
                      className="btn btn-success mt-2 mt-md-0 w-100"
                      onClick={() => jobProposalFormState.setJobId(id)}
                    >
                      Send proposal
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}

            {main.sessionUser.admin ? (
              <div className="d-flex align-items-center">
                <div className="dropdown job-proposal-statuses-change">
                  <div className="admin-job-view-actions">
                    <a
                      href={"/system-chat/" + job.authorId}
                      className="btn btn-primary w-100"
                    >
                      Write to job author
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className="card">
          <CommentCard
            comments={comments}
            totalCount={totalCount}
            handleCreateComment={handleCreateComment}
            handleCreateReplyComment={handleCreateReplyComment}
            onGetMoreCommentsClick={onGetMoreCommentsClick}
            onGetMoreReplyCommentsClick={onGetMoreReplyCommentsClick}
            needStarField={false}
          />
        </div>
      </div>

      <PopupWrapper
        onClose={jobProposalFormState.hide}
        activeTrigger={jobProposalFormState.active}
        title="Send proposal"
        id="send_proposal"
      >
        <JobProposalForm
          send={jobProposalFormState.sendProposal}
          price={jobProposalFormState.data.price}
          time={jobProposalFormState.data.time}
          setTime={jobProposalFormState.setTime}
          setPrice={jobProposalFormState.setPrice}
        />
      </PopupWrapper>
    </Layout>
  );
};

export default JobView;
