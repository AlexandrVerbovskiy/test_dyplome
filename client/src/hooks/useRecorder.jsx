import { useState, useEffect, useRef } from "react";

const useRecorder = () => {
  const [active, setActive] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);
  const [recordingMediaType, setRecordingMediaType] = useState("audio");
  const [recording, setRecording] = useState(false);

  const stop = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setRecording(false);
  };

  useEffect(
    () => {
      if (active) {
        setRecordingTime(0);
        setRecording(true);
        timerRef.current = setInterval(
          () => setRecordingTime(prev => (prev += 100)),
          100
        );
      } else {
        stop();
      }
    },
    [active]
  );

  const changeRecordingMediaType = () => {
    setRecordingMediaType(prev => {
      if (prev == "audio") return "video";
      if (prev == "video") return "audio";
      return null;
    });
  };

  const close = () => setActive(false);
  const open = () => setActive(true);

  return {
    active,
    close,
    open,
    stop,
    recording,
    recordingTime,
    recordingMediaType,
    changeRecordingMediaType
  };
};

export default useRecorder;
