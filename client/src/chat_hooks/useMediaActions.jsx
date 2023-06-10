import { useRef } from "react";
import { randomString, splitBlob } from "../utils";
import config from "../config";

const useMediaActions = () => {
  const mediaActionsRef = useRef({});

  async function createMediaActions(mediaBlob, filetype, dop) {
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
      filetype,
      dop: { ...dop }
    };

    const blobToSend = mediaActionsRef.current[tempFileKey]["inQueue"][0];
    const last = mediaActionsRef.current[tempFileKey]["inQueue"].length == 1;

    return {
      temp_key: tempFileKey,
      type: filetype,
      data: blobToSend,
      last,
      ...dop
    };
  }

  async function onSuccessSendBlobPart(key) {
    console.log("key: ", key, mediaActionsRef.current[key]["inQueue"].length);

    const action = mediaActionsRef.current[key];
    if (!action) return null;

    if (action["inQueue"].length == 1) {
      delete mediaActionsRef.current[key];
      return "success saved";
    } else {
      action["inQueue"].shift();
    }

    action["percent"] =
      (action["data"].length - action["inQueue"].length) /
      action["data"].length *
      100;

    const blob = mediaActionsRef.current[key]["inQueue"][0];
    const type = mediaActionsRef.current[key]["filetype"];
    const last = action["inQueue"].length == 1;
    const dop = action["dop"];

    return {
      temp_key: key,
      type,
      data: blob,
      last,
      ...dop
    };
  }

  async function onStopSendMedia(key) {
    if (mediaActionsRef.current[key]) delete mediaActionsRef.current[key];
  }

  return { createMediaActions, onSuccessSendBlobPart, onStopSendMedia };
};

export default useMediaActions;
