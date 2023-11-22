import getComments from "./getComments";

const getReplyComments = (data, successCallback, errorCallback) =>
  getComments(data, "reply", successCallback, errorCallback);

export default getReplyComments;
