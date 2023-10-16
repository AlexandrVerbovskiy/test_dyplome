import { axios } from "../utils";
import config from "../config";

const getAdminDisputes = async (data, successCallback, errorCallback) => {
  try {
    const res = await axios.post(config.API_URL + `/get-admin-disputes`, data);
    const disputes = res.data["disputes"] ?? [];
    successCallback(disputes);
  } catch (err) {
    const res = err.response;
    if (res && res.status && res.data && res.data.error)
      return errorCallback(res.data.error);
    errorCallback(err.message);
  }
};

export default getAdminDisputes;
