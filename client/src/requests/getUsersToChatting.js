import {
    axios
} from "../utils";

const getUsersToChatting = async (successCallback, errorCallback) => {
    try {
        const res = await axios.get("http://localhost:5000/users-to-chatting");
        console.log(res.data);
        successCallback(res.data);
    } catch (err) {
        const res = err.response;
        if (res && res.status && res.data && res.data.error)
            return errorCallback(res.data.error);
        errorCallback(err.message)
    }
}

export default getUsersToChatting;