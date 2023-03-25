import {
    axios
} from "../utils";

const login = async (data, successCallback, errorCallback) => {
    try {
        const res = await axios.post("http://localhost:5000/login", data);
        const token = res.data.token;
        console.log(res.data, token);
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