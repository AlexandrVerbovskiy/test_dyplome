import { useRef, useEffect } from "react";

const VisualizeAudio = ({ active, handlePlay }) => {
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const analyzerRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);

  const visualizeAudio = () => {
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    analyzerRef.current = analyzer;

    const mediaStream = navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStream.then(stream => {
      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      source.connect(analyzer);
      //analyzer.connect(audioContext.destination);

      const canvas = canvasRef.current;
      const canvasContext = canvas.getContext("2d");

      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        const request = requestRef.current;
        requestRef.current = requestAnimationFrame(draw);

        analyzer.getByteFrequencyData(dataArray);

        if (document.querySelector("html").classList.contains("dark-theme")) {
          canvasContext.fillStyle = "#171717";
        } else {
          canvasContext.fillStyle = "#FFFFFF";
        }
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);

        const barWidth = WIDTH / bufferLength * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];

          canvasContext.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
          canvasContext.fillRect(
            x,
            HEIGHT - barHeight / 2,
            barWidth,
            barHeight / 2
          );

          x += barWidth + 1;
        }
      };

      requestRef.current = requestAnimationFrame(draw);
    });
    handlePlay();
  };

  const stopVisualizingAudio = () => {
    const audioContext = audioContextRef.current;
    const source = sourceRef.current;
    const analyzer = analyzerRef.current;

    if (source) {
      source.disconnect(analyzer);
      source.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (analyzer && analyzer.isConnected) {
      analyzer.disconnect(audioContext.destination);
      analyzer.disconnect();
    }
    if (audioContext) audioContext.close();
  };

  useEffect(
    () => {
      if (active) {
        visualizeAudio();
      } else {
        stopVisualizingAudio();
      }
    },
    [active]
  );

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: "100%", height: "200px" }} />
    </div>
  );
};

export default VisualizeAudio;
