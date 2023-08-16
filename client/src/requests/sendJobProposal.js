import {
    axios
} from "../utils";
import config from "../config";

const sendJobProposal = async (data, successCallback, errorCallback) => {
    try {
        const res = await axios.post(config.API_URL + "/send-job-proposal", data);
        const token = res.headers.authorization.split(" ")[1];
        localStorage.setItem("token", token);
        successCallback(res.data);
    } catch (err) {
        const res = err.response;
        if (res && res.status && res.data && res.data.error)
            return errorCallback(res.data.error);
        errorCallback(err.message)
    }
}

export default sendJobProposal;