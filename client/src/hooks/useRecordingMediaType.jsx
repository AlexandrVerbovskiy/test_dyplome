import { useState } from "react";

const useRecordingMediaType = () => {
  const [recordingMediaType, setRecordingMediaType] = useState("audio");

  const changeRecordingMediaType = () => {
    setRecordingMediaType(prev => {
      if (prev == "audio") return "video";
      if (prev == "video") return "audio";
      return null;
    });
  };

  return { recordingMediaType, changeRecordingMediaType };
};

export default useRecordingMediaType;
