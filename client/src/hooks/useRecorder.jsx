import { useState, useEffect, useRef } from "react";
import { randomString, startRecording } from "../utils";

const useRecorder = setFile => {
  const [active, setActive] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);
  const [recordingMediaType, setRecordingMediaType] = useState("audio");
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);

  const stop = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setRecording(false);
  };

  useEffect(
    () => {
      if (active) setRecordingTime(0);
      if (!active) stop();
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

  const handleStartRecording = async () => {
    const name = randomString();

    const afterRecording = blob => {
      const src = window.URL.createObjectURL(blob);
      const file = { src };
      file["type"] = recordingMediaType === "audio" ? "mp3" : "mp4";
      file["name"] = name + "." + file["type"];
      close();
      setFile(file);
    };

    const stopper = await startRecording(
      recordingMediaType,
      () => {
        setRecording(true);
        timerRef.current = setInterval(
          () => setRecordingTime(prev => (prev += 100)),
          100
        );
        setRecorder(() => stopper);
      },
      afterRecording
    );
  };

  const handleStopClick = async () => {
    await recorder();
    setRecorder(null);
  };

  return {
    active,
    close,
    open,
    stop,
    recording,
    recordingTime,
    recordingMediaType,
    changeRecordingMediaType,
    startRecording,
    handleStartRecording,
    handleStopClick
  };
};

export default useRecorder;
