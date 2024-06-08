import config from "_config";

const generateFullUserImgPath = (url, system) => {
  let res = "/assets/images/icons/no-profile.jpg";

  if (system) {
    res = "/assets/images/logo-icon.png";
  }

  if (url) {
    res = config.API_URL + "/" + url;
  }

  return res;
};

export default generateFullUserImgPath;
