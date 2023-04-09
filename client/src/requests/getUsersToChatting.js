import {
    axios
} from "../utils";
import config from "../config";

const getUsersToChatting = async (data, successCallback, errorCallback) => {
    try {
        const res = await axios.post(config.API_URL + "/users-to-chatting", data);
        successCallback(res.data);
    } catch (err) {
        const res = err.response;
        if (res && res.status && res.data && res.data.error)
            return errorCallback(res.data.error);
        errorCallback(err.message)
    }
}

export default getUsersToChatting;