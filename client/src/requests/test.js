import { axios } from "../utils";

const test = async(data, successCallback, errorCallback)=>{
    try {
        const res = await axios.post("http://localhost:5000/test", data);
        successCallback();
      } catch (err) {
        errorCallback();
      }
}

export default test;