import { axios } from "../utils";
import config from "../config";

const getChatMessagesByAdmin = async (data, successCallback, errorCallback) => {
  try {
    const res = await axios.post(
      config.API_URL + "/get-full-chat-messages",
      data
    );
    successCallback(res.data.messages);
  } catch (err) {
    const res = err.response;
    if (res && res.status && res.data && res.data.error)
      return errorCallback(res.data.error);
    errorCallback(err.message);
  }
};

export default getChatMessagesByAdmin;
