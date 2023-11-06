import config from "../config";

const generateFullUserImgPath = (url) => {
  return url
    ? config.API_URL + "/" + url
    : "/assets/images/icons/no-profile.jpg";
};

export default generateFullUserImgPath;
