import React from "react";
import { axios } from "../utils";
import config from "../config";

const useAjaxRequest = ({ onError }) => {
  return async function ({
    url,
    type = "get",
    data = {},
    onSuccess = () => {},
    convertRes = () => {},
  }) {
    try {
      let res = null;

      if (type == "get") {
        res = await axios.get(`${config.API_URL}/${url}`);
      } else {
        res = await axios.post(`${config.API_URL}/${url}`, data);
      }

      const convertedData = convertRes ? convertRes(res) : res;

      onSuccess(convertedData);
      return convertedData;
    } catch (err) {
      const res = err.response;

      if (res && res.status && res.data && res.data.error) {
        onError(res.data.error);
      } else {
        onError(err.message);
      }

      throw new Error(err.message);
    }
  };
};

export default useAjaxRequest;
