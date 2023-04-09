import {
  axios
} from "../utils";
import config from "../config";

const test = async (data, successCallback, errorCallback) => {
  try {
    const res = await axios.post(config.API_URL + "/test", data);
    successCallback();
  } catch (err) {
    errorCallback();
  }
}

export default test;