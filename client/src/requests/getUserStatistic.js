import { axios } from "../utils";
import config from "../config";

const getUserStatistic = async (userId, successCallback, errorCallback) => {
  try {
    const res = await axios.get(
      config.API_URL + `/get-user-statistic/${userId}`
    );
    successCallback(res.data);
  } catch (err) {
    const res = err.response;
    if (res && res.status && res.data && res.data.error)
      return errorCallback(res.data.error);
    errorCallback(err.message);
  }
};

export default getUserStatistic;
