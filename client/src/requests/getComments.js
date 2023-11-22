import { axios } from "../utils";
import config from "../config";

const getComments = async (data, type, successCallback, errorCallback) => {
  try {
    const res = await axios.post(
      config.API_URL + `/get-full-chat-messages/${type}`,
      data
    );
    successCallback(res.data.comments);
  } catch (err) {
    const res = err.response;
    if (res && res.status && res.data && res.data.error)
      return errorCallback(res.data.error);
    errorCallback(err.message);
  }
};

export default getComments;
