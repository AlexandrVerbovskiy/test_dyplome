import {
    axios
} from "../utils";
import config from "../config";

const login = async (data, successCallback, errorCallback) => {
    try {
        const res = await axios.post(config.API_URL + "/login", data);
        const token = res.headers.authorization.split(" ")[1];
        localStorage.setItem("token", token);
        successCallback();
    } catch (err) {
        const res = err.response;
        if (res && res.status && res.data && res.data.error)
            return errorCallback(res.data.error);
        errorCallback(err.message)
    }
}

export default login;