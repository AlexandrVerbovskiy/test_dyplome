import React, { useState, useEffect, useContext } from "react";
import useAddressCoordsRelation from "./useAddressCoordsRelation";

const useAdminUserEdit = ({ baseData }) => {
  const [nick, setNick] = useState({ value: "", error: null });
  const [email, setEmail] = useState({ value: "", error: null });
  const [profileImg, setProfileImg] = useState({ value: null, error: null });
  const [admin, setAdmin] = useState({ value: false, error: null });
  const [authorized, setAuthorized] = useState({ value: false, error: null });

  const { coords, address, addressCoordsValidate } = useAddressCoordsRelation();

  useEffect(() => {
    if (!baseData) return;

    coords.change({ lat: baseData.lat ?? 0, lng: baseData.lng ?? 0 });
    address.change(baseData.address ?? "");
    changeEmail(baseData.email ?? "");
    changeNick(baseData.nick ?? "");

    if (baseData.avatar) changeImg(baseData.avatar);
  }, [baseData]);

  const changeEmail = (email) => {
    setEmail({ value: email, error: null });
  };

  const changeNick = (nick) => {
    setNick({ value: nick, error: null });
  };

  const changeAuthorized = () => {
    setAuthorized({ value: !authorized.value, error: null });
  };

  const changeAdmin = () => {
    setAdmin({ value: !admin.value, error: null });
  };

  const changeImg = (img) => {
    setProfileImg({ value: img, error: null });
  };

  const validateProfileEdit = () => {
    let validated = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      setEmail((prev) => ({
        ...prev,
        error:
          "Invalid email format. Please enter an email in the format 'example@example.com'.",
      }));
      validated = false;
    }

    if (nick.value.length < 2) {
      setNick((prev) => ({
        ...prev,
        error: "Nick must be longer than 2 characters",
      }));
      validated = false;
    }

    if (!profileImg.value) {
      setProfileImg((prev) => ({
        ...prev,
        error: "Profile image can't be empty",
      }));
      validated = false;
    }

    validated = addressCoordsValidate() && validated;
    return validated;
  };

  return {
    coords: { ...coords },
    address: { ...address },
    email: { ...email, change: changeEmail },
    nick: { ...nick, change: changeNick },
    profileImg: { ...profileImg, change: changeImg },
    validateProfileEdit,
    admin: { ...admin, change: changeAdmin },
    authorized: { ...authorized, change: changeAuthorized },
  };
};

export default useAdminUserEdit;
