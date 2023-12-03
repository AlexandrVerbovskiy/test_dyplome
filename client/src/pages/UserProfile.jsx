import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { CommentCard, Navbar } from "../components";
import { LineChart } from "../charts";
import { useProfileStatisticInfo, useComments } from "../hooks";
import { UserProfileStatisticInfo } from "../profile_components";
import config from "../config";

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
    <div className="page-wrapper user-page">
      <Navbar />
      <div className="page-content">
        <div className="card profile-comments-type-select">
          <div className="card-title">
            <div className="row">
              <h6
                onClick={handleSetSellerType}
                className={`col ${type == sellerType ? "active" : ""}`}
              >
                Seller Comments
              </h6>
              <h6
                onClick={handleSetWorkerType}
                className={`col ${type == workerType ? "active" : ""}`}
              >
                Worker Comments
              </h6>
            </div>
          </div>

          <CommentCard
            comments={comments}
            totalCount={totalCount}
            handleCreateComment={handleCreateComment}
            handleCreateReplyComment={handleCreateReplyComment}
            onGetMoreCommentsClick={onGetMoreCommentsClick}
            onGetMoreReplyCommentsClick={onGetMoreReplyCommentsClick}
            needStarField={true}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

/*

        <UserProfileStatisticInfo userInfo={userInfo} />

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
