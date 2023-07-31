import {
    axios
} from "../utils";
import config from "../config";

const getJobsByLocation = async (data, successCallback, errorCallback) => {
    try {
        const res = await axios.post(config.API_URL + `/get-jobs-by-location`, data);
        successCallback(res.data);
    } catch (err) {
        const res = err.response;
        if (res && res.status && res.data && res.data.error)
            return errorCallback(res.data.error);
        errorCallback(err.message)
    }
}

export default getJobsByLocation;