import { useRef } from "react";
import { randomString, splitBlob } from "../utils";
import config from "../config";

const useMediaActions = () => {
  const mediaActionsRef = useRef({});

  async function createMediaActions(blob) {
    const tempFileKey = randomString();
    const arr = await splitBlob(blob, config["BLOB_CHUNK_SIZE"], blob.type);

    console.log(arr);

    mediaActionsRef.current[tempFileKey] = {
      data: arr,
      percent: 0,
      inQueue: [...arr]
    };

    console.log(mediaActionsRef.current);

    return mediaActionsRef.current[tempFileKey]["inQueue"][0];
  }

  async function onSuccessSendBlobPart(key) {
    const action = mediaActionsRef.current[key];
    if (!action) return;

    const blob = mediaActionsRef.current[key]["inQueue"][0];

    if (action["inQueue"].length == 1) {
      delete mediaActionsRef.current[key];
    } else {
      action["inQueue"].shift();
      action["percent"] =
        (action["data"].length - action["inQueue"].length) /
        action["data"].length *
        100;
    }
    return blob;
  }

  async function onStopSendMedia(key) {
    if (mediaActionsRef.current[key]) delete mediaActionsRef.current[key];
  }

  return { createMediaActions, onSuccessSendBlobPart, onStopSendMedia };
};

export default useMediaActions;
