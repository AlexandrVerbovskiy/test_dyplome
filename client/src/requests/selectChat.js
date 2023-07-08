import {
    axios
} from "../utils";
import config from "../config";

const selectChat = async (chatId, successCallback, errorCallback) => {
    try {
        const res = await axios.post(config.API_URL + "/select-chat", {
            chatId
        });
        successCallback(res.data.messages);
    } catch (err) {
        const res = err.response;
        if (res && res.status && res.data && res.data.error)
            return errorCallback(res.data.error);
        errorCallback(err.message)
    }
}

export default selectChat;