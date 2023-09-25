import { axios } from "../utils";
import config from "../config";

export const acceptJobProposal = async (id, successCallback, errorCallback) => {
  try {
    const res = await axios.post(config.API_URL + `/proposal-accept`, {
      proposal_id: id,
    });
    successCallback(res.data);
  } catch (err) {
    const res = err.response;
    if (res && res.status && res.data && res.data.error)
      return errorCallback(res.data.error);
    errorCallback(err.message);
  }
};

export const rejectJobProposal = async (id, successCallback, errorCallback) => {
  try {
    const res = await axios.post(config.API_URL + `/proposal-reject`, {
      proposal_id: id,
    });
    successCallback(res.data);
  } catch (err) {
    const res = err.response;
    if (res && res.status && res.data && res.data.error)
      return errorCallback(res.data.error);
    errorCallback(err.message);
  }
};

export const cancelJobProposal = async (id, successCallback, errorCallback) => {
  try {
    const res = await axios.post(config.API_URL + `/proposal-cancel`, {
      proposal_id: id,
    });
    successCallback(res.data);
  } catch (err) {
    const res = err.response;
    if (res && res.status && res.data && res.data.error)
      return errorCallback(res.data.error);
    errorCallback(err.message);
  }
};

export const acceptCancelJobProposal = async (
  id,
  successCallback,
  errorCallback
) => {
  try {
    const res = await axios.post(config.API_URL + `/proposal-accept-cancel`, {
      proposal_id: id,
    });
    successCallback(res.data);
  } catch (err) {
    const res = err.response;
    if (res && res.status && res.data && res.data.error)
      return errorCallback(res.data.error);
    errorCallback(err.message);
  }
};

export const completeJobProposal = async (
  id,
  successCallback,
  errorCallback
) => {
  try {
    const res = await axios.post(config.API_URL + `/proposal-complete`, {
      proposal_id: id,
    });
    successCallback(res.data);
  } catch (err) {
    const res = err.response;
    if (res && res.status && res.data && res.data.error)
      return errorCallback(res.data.error);
    errorCallback(err.message);
  }
};

export const acceptCompleteJobProposal = async (
  id,
  successCallback,
  errorCallback
) => {
  try {
    const res = await axios.post(config.API_URL + `/proposal-accept-complete`, {
      proposal_id: id,
    });
    successCallback(res.data);
  } catch (err) {
    const res = err.response;
    if (res && res.status && res.data && res.data.error)
      return errorCallback(res.data.error);
    errorCallback(err.message);
  }
};

export default {
  acceptJobProposal,
  rejectJobProposal,
  cancelJobProposal,
  acceptCancelJobProposal,
  completeJobProposal,
  acceptCompleteJobProposal,
};
