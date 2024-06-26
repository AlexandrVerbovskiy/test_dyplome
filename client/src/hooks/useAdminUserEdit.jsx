import React, { useState, useEffect, useContext } from "react";
import useAddressCoordsRelation from "./useAddressCoordsRelation";
import config from "_config";

const useAdminUserEdit = ({ baseData }) => {
  const [nick, setNick] = useState({ value: "", error: null });
  const [balance, setBalance] = useState({ value: 0, error: null });
  const [email, setEmail] = useState({ value: "", error: null });
  const [phone, setPhone] = useState({ value: "", error: null });
  const [biography, setBiography] = useState({ value: "", error: null });
  const [instagramUrl, setInstagramUrl] = useState({ value: "", error: null });
  const [linkedinUrl, setLinkedinUrl] = useState({ value: "", error: null });
  const [profileImg, setProfileImg] = useState({ value: null, error: null });
  const [admin, setAdmin] = useState({ value: false, error: null });
  const [authorized, setAuthorized] = useState({ value: false, error: null });
  const [activityRadius, setActivityRadius] = useState(config.RADIUS_DEFAULT);

  const { coords, address, addressCoordsValidate } = useAddressCoordsRelation();

  useEffect(() => {
    if (!baseData) return;

    coords.set({ lat: baseData.lat ?? 0, lng: baseData.lng ?? 0 });
    address.set(baseData.address ?? "");
    changeEmail(baseData.email ?? "");
    changeNick(baseData.nick ?? "");
    changeBalance(baseData.balance ?? 0);
    changeBiography(baseData.biography ?? "");
    changeInstagramUrl(baseData.instagramUrl ?? "");
    changeLinkedinUrl(baseData.linkedinUrl ?? "");
    changePhone(baseData.phone ?? "");
    
    setAdmin({ value: baseData.admin ?? false, error: null });
    setAuthorized({ value: baseData.profileAuthorized ?? false, error: null });

    setActivityRadius(baseData.activityRadius ?? config.RADIUS_DEFAULT);

    if (baseData.avatar) changeImg(baseData.avatar);
  }, [baseData]);

  const changeEmail = (email) => {
    setEmail({ value: email, error: null });
  };

  const changeNick = (nick) => {
    setNick({ value: nick, error: null });
  };

  const changeBalance = (balance) => {
    setBalance({ value: balance, error: null });
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

  const changePhone = (phone) => {
    setPhone({ value: phone, error: null });
  };

  const changeBiography = (biography) => {
    setBiography({ value: biography, error: null });
  };

  const changeLinkedinUrl = (linkedinUrl) => {
    setLinkedinUrl({ value: linkedinUrl, error: null });
  };

  const changeInstagramUrl = (instagramUrl) => {
    setInstagramUrl({ value: instagramUrl, error: null });
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

    if (balance.value && isNaN(Number(balance.value))) {
      setBalance((prev) => ({
        ...prev,
        error: "Balance must be a number",
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
    activityRadius: { value: activityRadius, change: setActivityRadius },
    balance: { ...balance, change: changeBalance },
    biography: { ...biography, change: changeBiography },
    phone: { ...phone, change: changePhone },
    instagramUrl: { ...instagramUrl, change: changeInstagramUrl },
    linkedinUrl: { ...linkedinUrl, change: changeLinkedinUrl },
  };
};

export default useAdminUserEdit;
