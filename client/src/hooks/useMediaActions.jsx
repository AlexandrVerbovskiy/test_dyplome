import { useRef } from "react";
import { randomString, splitBlob } from "../utils";
import config from "../config";

const useMediaActions = () => {
  const mediaActionsRef = useRef({});

  async function createMediaActions(mediaBlob, filetype) {
    const tempFileKey = randomString();
    const arr = await splitBlob(
      mediaBlob,
      config["BLOB_CHUNK_SIZE"],
      mediaBlob.type
    );

    mediaActionsRef.current[tempFileKey] = {
      data: arr,
      percent: 0,
      inQueue: [...arr],
      filetype
    };

    const action = mediaActionsRef.current[tempFileKey];
    const blobToSend = mediaActionsRef.current[tempFileKey]["inQueue"][0];

    if (action["inQueue"].length == 1) {
      delete mediaActionsRef.current[tempFileKey];
    } else {
      action["inQueue"].shift();
    }

    return {
      temp_key: tempFileKey,
      type: filetype,
      data: blobToSend
    };
  }

  async function onSuccessSendBlobPart(key) {
    const action = mediaActionsRef.current[key];
    if (!action) return null;

    const blob = mediaActionsRef.current[key]["inQueue"][0];
    const type = mediaActionsRef.current[key]["filetype"];

    if (action["inQueue"].length == 1) {
      delete mediaActionsRef.current[key];
    } else {
      action["inQueue"].shift();
      action["percent"] =
        (action["data"].length - action["inQueue"].length) /
        action["data"].length *
        100;
    }
    return {
      temp_key: key,
      type,
      data: blob
    };
  }

  async function onStopSendMedia(key) {
    if (mediaActionsRef.current[key]) delete mediaActionsRef.current[key];
  }

  return { createMediaActions, onSuccessSendBlobPart, onStopSendMedia };
};

export default useMediaActions;
