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
        if (validated) {
            const token = res.headers.authorization.split(" ")[1];
            if (!token) return successCallback(false);
            localStorage.setItem("token", token);
            return successCallback(res.data.userId);
        }

        localStorage.removeItem("token");
        return successCallback(false);

    } catch (err) {
        errorCallback(err.message)
    }
}

export default validateToken;