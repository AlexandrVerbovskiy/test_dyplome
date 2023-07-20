import React, { useState, useEffect } from "react";
import useAddressCoordsRelation from "./useAddressCoordsRelation";
import { getProfileInfo } from "../requests";

const useProfileEdit = () => {
  const [nick, setNick] = useState({ value: "", error: null });
  const [email, setEmail] = useState({ value: "", error: null });
  const [profileImg, setProfileImg] = useState({ value: null, error: null });
  const { coords, address, addressCoordsValidate } = useAddressCoordsRelation();

  useEffect(() => {
    getProfileInfo(
      res => {
        if (!res) return;
        coords.change({ lat: res.lat, lng: res.lng });
        address.change(res.address);
        changeEmail(res.email);
        changeNick(res.nick);
        if (res.avatar) changeImg(res.avatar);
      },
      err => console.log(err)
    );
  }, []);

  const changeEmail = email => {
    setEmail({ value: email, error: null });
  };

  const changeNick = nick => {
    setNick({ value: nick, error: null });
  };

  const changeImg = img => {
    setProfileImg({ value: img, error: null });
  };

  const validateProfileEdit = () => {
    let validated = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      setEmail(prev => ({
        ...prev,
        error:
          "Invalid email format. Please enter an email in the format 'example@example.com'."
      }));
      validated = false;
    }

    if (nick.value.length < 2) {
      setNick(prev => ({
        ...prev,
        error: "Nick must be longer than 2 characters"
      }));
      validated = false;
    }

    if (!profileImg.value) {
      setProfileImg(prev => ({
        ...prev,
        error: "Profile image can't be empty"
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
    validateProfileEdit
  };
};

export default useProfileEdit;
