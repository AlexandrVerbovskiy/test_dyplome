import {
    axios
} from "../utils";
import config from "../config";

const validateToken = async (token, successCallback, errorCallback) => {
    try {
        const res = await axios.post(config.API_URL + "/check-token", {
            token
        });
        const validated = res.data.validated;
        if (validated && res.data.token){
            const token = res.data.token;
            localStorage.setItem("token", token);
            return successCallback(true);
        }

        localStorage.removeItem("token");
        return successCallback(false);

    } catch (err) {
        errorCallback(err.message)
    }
}

export default validateToken;