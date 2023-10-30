import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserStatistic } from "../requests";
import { Navbar } from "../components";

const UserProfile = () => {
  let { userId } = useParams();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    console.log(userId);

    getUserStatistic(
      userId,
      (data) => {
        console.log(data);
        setUserInfo(data);
      },
      () => {}
    );
  }, [userId]);

  if (!userInfo) return <div></div>;

  return (
    <div className="page-wrapper job-edit-page">
      <Navbar />
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            <div className="card-title">
              <h6 className="card-label">
                User Statistic: {userInfo["email"]}{" "}
                {userInfo["nick"] && `(${userInfo["email"]})`}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
