import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar, StarCommentForm } from "../components";
import { LineChart } from "../charts";
import { useProfileStatisticInfo } from "../hooks";
import { UserProfileStatisticInfo } from "../profile_components";

const sellerType = "seller";
const workerType = "worker";

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

  if (!userInfo) return <div></div>;

  const onChangeType = (newType) => {
    setType(newType);
  };

  const handleSetWorkerType = () => onChangeType(workerType);
  const handleSetSellerType = () => onChangeType(sellerType);

  const handleSendComment = (res) => {
    console.log({ ...res, commentType: type, userId });
  };

  return (
    <div className="page-wrapper user-page">
      <Navbar />
      <div className="page-content">
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
          <div className="card-body">
            <StarCommentForm onSubmit={handleSendComment} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
