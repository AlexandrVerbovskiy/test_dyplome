import {
    axios
} from "../utils";
import config from "../config";

const getMyProposals = async (data, successCallback, errorCallback) => {
    try {
        const res = await axios.post(config.API_URL + `/get-my-proposals`, data);
        const proposals = res.data["proposals"] ?? [];
        successCallback(proposals);
    } catch (err) {
        const res = err.response;
        if (res && res.status && res.data && res.data.error)
            return errorCallback(res.data.error);
        errorCallback(err.message)
    }
}

export default getMyProposals;