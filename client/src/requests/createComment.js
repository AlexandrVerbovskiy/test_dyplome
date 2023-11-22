import { axios } from "../utils";
import config from "../config";

const createDispute = async (data, type, successCallback, errorCallback) => {
  try {
    const res = await axios.post(
      config.API_URL + `/create-comment/${type}`,
      data
    );
    successCallback(res.data);
  } catch (err) {
    const res = err.response;
    if (res && res.status && res.data && res.data.error)
      return errorCallback(res.data.error);
    errorCallback(err.message);
  }
};

export default createDispute;
