import React, { useState, useEffect, useContext } from "react";
import useAddressCoordsRelation from "./useAddressCoordsRelation";
import { getProfileInfo } from "../requests";
import { MainContext } from "../contexts";
import config from "../config";

const useProfileEdit = () => {
  const [nick, setNick] = useState({ value: "", error: null });
  const [email, setEmail] = useState({ value: "", error: null });
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
        setActivityRadius(res.activity_radius ?? config.RADIUS_DEFAULT);

        if (res.lat === null && res.lng === null) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              coords.change({ lat: latitude, lng: longitude });
              console.log({ latitude, longitude });
            },
            (error) => {
              coords.change(config.MAP_DEFAULT.center);
            }
          );

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                coords.change({ lat: latitude, lng: longitude });
              },
              (error) => coords.change(config.MAP_DEFAULT.center)
            );
          } else {
            coords.change(config.MAP_DEFAULT.center);
          }
        } else {
          coords.change({
            lat: res.lat ?? config.MAP_DEFAULT.center.lat,
            lng: res.lng ?? config.MAP_DEFAULT.center.lng,
          });
          address.change(res.address ?? "");
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
  };
};

export default useProfileEdit;
