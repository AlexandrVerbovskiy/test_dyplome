import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { CommentCard, Layout, UserProfileStatisticInfo } from "components";
import { useProfileStatisticInfo, useComments } from "hooks";
import config from "config";

const sellerType = config.COMMENT_TYPES.employee;
const workerType = config.COMMENT_TYPES.worker;

const UserProfile = () => {
  let { userId } = useParams();
  const [type, setType] = useState(sellerType);

  const {
    userInfo,
    forUserInfo,
    byUserInfo,
    countFinishedByKeys,
    countFinishedForKeys,
  } = useProfileStatisticInfo({ userId });

  const {
    comments,
    totalCount,
    handleCreateComment,
    handleCreateReplyComment,
    handleGetMoreComments,
    handleGetMoreReplyComments,
  } = useComments({ entityId: userId, type });

  if (!userInfo) return <div></div>;

  const onChangeType = (newType) => {
    setType(newType);
  };

  const handleSetWorkerType = () => onChangeType(workerType);
  const handleSetSellerType = () => onChangeType(sellerType);
  const onGetMoreCommentsClick = () => handleGetMoreComments();
  const onGetMoreReplyCommentsClick = (parentCommentId) => {
    handleGetMoreReplyComments(parentCommentId);
  };

  return (
    <Layout pageClassName="default-view-page">
      <div className="page-content">
        <UserProfileStatisticInfo
          userInfo={userInfo}
          handleSetSellerType={handleSetSellerType}
          handleSetWorkerType={handleSetWorkerType}
          type={type}
        />

        <div className="card">
          <div className="row card-header-type-select">
            <div className="col" style={{ paddingRight: "0" }}>
              <h6
                onClick={handleSetSellerType}
                className={`${type == sellerType ? "active" : ""}`}
                style={{
                  padding: "1rem",
                  marginBottom: "0",
                  textAlign: "center",
                }}
              >
                Employee Comments
              </h6>
            </div>
            <div className="col" style={{ paddingLeft: "0" }}>
              <h6
                onClick={handleSetWorkerType}
                className={`${type == workerType ? "active" : ""}`}
                style={{
                  padding: "1rem",
                  marginBottom: "0",
                  textAlign: "center",
                }}
              >
                Worker Comments
              </h6>
            </div>
          </div>

          <hr style={{ marginTop: "0" }} />

          <CommentCard
            comments={comments}
            totalCount={totalCount}
            handleCreateComment={handleCreateComment}
            handleCreateReplyComment={(data, replyCommentId) =>
              handleCreateReplyComment(data, replyCommentId, type, userId)
            }
            onGetMoreCommentsClick={onGetMoreCommentsClick}
            onGetMoreReplyCommentsClick={onGetMoreReplyCommentsClick}
            needStarField={true}
          />
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;

/*
        <LineChart
          info={byUserInfo}
          title="Count finished jobs by "
          keys={countFinishedByKeys}
        />

        <LineChart
          info={forUserInfo}
          title="Count finished jobs for "
          keys={countFinishedForKeys}
        />

*/
