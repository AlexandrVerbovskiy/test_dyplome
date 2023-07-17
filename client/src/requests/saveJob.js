import {
    axios
} from "../utils";
import config from "../config";

const saveJob = async (data, successCallback, errorCallback, type = "create") => {
    const path = config.API_URL + (type == "create" ? "/create-job" : "/edit-job");
    try {
        const res = await axios.post(path, data);
        successCallback(res.data);
    } catch (err) {
        const res = err.response;
        if (res && res.status && res.data && res.data.error)
            return errorCallback(res.data.error);
        errorCallback(err.message)
    }
}

export default saveJob;