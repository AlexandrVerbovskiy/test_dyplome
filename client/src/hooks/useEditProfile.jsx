import React, { useState } from "react";

import {
  fullAddressToString,
  getAddressByCoords,
  getCoordsByAddress
} from "../utils";

const useEditProfile = () => {
  const [coords, setCoords] = useState({ value: null, error: null });
  const [address, setAddress] = useState({ value: "", error: null });
  const [nick, setNick] = useState({ value: "", error: null });
  const [email, setEmail] = useState({ value: "", error: null });
  const [profileImg, setProfileImg] = useState({ value: null, error: null });

  const changeCoords = async coords => {
    setCoords({ value: coords, error: null });
    const address = await getAddressByCoords(coords);
    const strAddress = fullAddressToString(address);
    setAddress({ value: strAddress, error: null });
  };

  const changeAddress = async address => {
    setAddress({ value: address, error: null });
    const res = await getCoordsByAddress(address);
    setCoords({ value: res, error: null });
  };

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

    if (!coords.value) {
      setAddress(prev => ({
        ...prev,
        error: "Without coordinates, the program cannot find tasks nearby"
      }));
      validated = false;
    }

    return validated;
  };

  return {
    coords: { value: coords.value, error: coords.error, change: changeCoords },
    address: { ...address, change: changeAddress },
    email: { ...email, change: changeEmail },
    nick: { ...nick, change: changeNick },
    profileImg: { ...profileImg, change: changeImg },
    validateProfileEdit
  };
};

export default useEditProfile;
