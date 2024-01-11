import React, { useEffect, useRef, useState } from "react";

const VisualizeCamera = ({ active, handlePlay }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [streamError, setStreamError] = useState(null);

  useEffect(() => {
    setStreamError(null);
    if (active) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          const video = videoRef.current;
          video.srcObject = stream;
          video.play();
          streamRef.current = stream;
        })
        .catch((err) => {
          setStreamError(err.message);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    }
  }, [active]);

  if (streamError)
    return (
      <div style={{ textAlign: "center" }}>
        {streamError}.<br /> Maybe the camera is being used by another
        application
      </div>
    );

  return (
    <video
      style={{ width: "100%", height: "300px", transform: "scaleX(-1)" }}
      ref={videoRef}
      autoPlay
      onCanPlay={handlePlay}
    />
  );
};

export default VisualizeCamera;
