import {
    axios
} from "../utils";
import config from "../config";

const registration = async (data, successCallback, errorCallback) => {
    try {
        await axios.post(config.API_URL + "/register", data);
        successCallback();
    } catch (err) {
        const res = err.response;
        if (res && res.status && res.data && res.data.error)
            return errorCallback(res.data.error);
        errorCallback(err.message)
    }
}

export default registration;