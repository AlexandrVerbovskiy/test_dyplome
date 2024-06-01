import React, { useState } from "react";
import { useParams } from "react-router-dom";
import BaseUserProfile from "components/BaseUserProfile";

const UserProfile = () => {
  const { userId } = useParams();
  return <BaseUserProfile userId={userId} />;
};

export default UserProfile;
