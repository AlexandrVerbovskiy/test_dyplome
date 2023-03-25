import {
    axios
} from "../utils";

const validateToken = async (token, successCallback, errorCallback) => {
    try {
        const res = await axios.post("http://localhost:5000/check-token", {
            token
        });
        const validated = res.data.validated;
        if (validated)
            return successCallback(true);

        localStorage.removeItem("token");
        return successCallback(false);

    } catch (err) {
        errorCallback(err.message)
    }
}

export default validateToken;