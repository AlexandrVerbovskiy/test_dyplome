import { axios } from "../utils";
import config from "../config";

const getJobProposalInfo = async (id, successCallback, errorCallback) => {
  try {
    const res = await axios.get(config.API_URL + `/get-job-proposal/${id}`);
    successCallback(res.data.proposal);
  } catch (err) {
    const res = err.response;
    if (res && res.status && res.data && res.data.error)
      return errorCallback(res.data.error);
    errorCallback(err.message);
  }
};

export default getJobProposalInfo;
