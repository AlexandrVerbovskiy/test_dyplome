import React, { useContext, useState } from "react";
import BaseUserProfile from "components/BaseUserProfile";
import { MainContext } from "contexts";

const CurrentUserProfile = () => {
  const main = useContext(MainContext);
  const userId = main.sessionUser.id;

  if (!userId) {
    return <div></div>;
  }

  return <BaseUserProfile userId={userId} />;
};

export default CurrentUserProfile;
