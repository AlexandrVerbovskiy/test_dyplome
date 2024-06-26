import React, { useState, useEffect, useContext } from "react";
import useAddressCoordsRelation from "./useAddressCoordsRelation";
import { getProfileInfo } from "requests";
import { MainContext } from "contexts";
import config from "_config";

const useProfileEdit = () => {
  const [nick, setNick] = useState({ value: "", error: null });
  const [email, setEmail] = useState({ value: "", error: null });
  const [phone, setPhone] = useState({ value: "", error: null });
  const [biography, setBiography] = useState({ value: "", error: null });
  const [instagramUrl, setInstagramUrl] = useState({ value: "", error: null });
  const [linkedinUrl, setLinkedinUrl] = useState({ value: "", error: null });
  const [profileImg, setProfileImg] = useState({ value: null, error: null });
  const [activityRadius, setActivityRadius] = useState(config.RADIUS_DEFAULT);
  const { coords, address, addressCoordsValidate } = useAddressCoordsRelation();
  const main = useContext(MainContext);

  useEffect(() => {
    (async () => {
      try {
        const res = await main.request({
          url: getProfileInfo.url(),
          type: getProfileInfo.type,
          convertRes: getProfileInfo.convertRes,
        });

        if (!res) return;

        changeEmail(res.email ?? "");
        changeNick(res.nick ?? "");
        setActivityRadius(res.activityRadius ?? config.RADIUS_DEFAULT);
        changeBiography(res.biography ?? "");
        changeInstagramUrl(res.instagramUrl ?? "");
        changeLinkedinUrl(res.linkedinUrl ?? "");
        changePhone(res.phone ?? "");

        if (res.lat === null && res.lng === null) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              coords.change({ lat: latitude, lng: longitude });
            },
            (error) => {
              coords.set(config.MAP_DEFAULT.center);
            }
          );

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                coords.change({ lat: latitude, lng: longitude });
              },
              (error) => coords.set(config.MAP_DEFAULT.center)
            );
          } else {
            coords.set(config.MAP_DEFAULT.center);
          }
        } else {
          coords.set({
            lat: res.lat ?? config.MAP_DEFAULT.center.lat,
            lng: res.lng ?? config.MAP_DEFAULT.center.lng,
          });
          address.set(res.address ?? "");
        }

        if (res.avatar) changeImg(res.avatar);
      } catch (e) {}
    })();
  }, []);

  const changeEmail = (email) => {
    setEmail({ value: email, error: null });
  };

  const changeNick = (nick) => {
    setNick({ value: nick, error: null });
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
    activityRadius: { value: activityRadius, change: setActivityRadius },
    biography: { ...biography, change: changeBiography },
    phone: { ...phone, change: changePhone },
    instagramUrl: { ...instagramUrl, change: changeInstagramUrl },
    linkedinUrl: { ...linkedinUrl, change: changeLinkedinUrl },
  };
};

export default useProfileEdit;
