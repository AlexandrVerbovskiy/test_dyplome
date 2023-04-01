import {
    axios
} from "../utils";

const getUsersToChatting = async (data, successCallback, errorCallback) => {
    try {
        const res = await axios.post("http://localhost:5000/users-to-chatting", data);
        successCallback(res.data);
    } catch (err) {
        const res = err.response;
        if (res && res.status && res.data && res.data.error)
            return errorCallback(res.data.error);
        errorCallback(err.message)
    }
}

export default getUsersToChatting;