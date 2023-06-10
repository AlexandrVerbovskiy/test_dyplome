import React, { useEffect, useRef } from "react";

const VisualizeCamera = ({ active, handlePlay }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(
    () => {
      if (active) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then(stream => {
            const video = videoRef.current;
            video.srcObject = stream;
            video.play();
            streamRef.current = stream;
          })
          .catch(err => {
            console.log("Error: " + err);
          });
      } else {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
            track.stop();
          });
        }
      }
    },
    [active]
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
