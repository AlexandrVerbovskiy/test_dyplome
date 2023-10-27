import { axios } from "../utils";
import config from "../config";

const adminAssignDispute = async (disputeId, successCallback, errorCallback) => {
  try {
    const res = await axios.post(config.API_URL + `/assign-dispute`, {
      disputeId,
    });
    successCallback(res.data);
  } catch (err) {
    const res = err.response;
    if (res && res.status && res.data && res.data.error)
      return errorCallback(res.data.error);
    errorCallback(err.message);
  }
};

export default adminAssignDispute;
