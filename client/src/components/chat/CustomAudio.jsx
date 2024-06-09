import React, { useRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { PauseFill, CaretRightFill } from "react-bootstrap-icons";

function formatTime(time) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  if (hours > 0) {
    const formattedHours = hours.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}

const AudioPlayer = ({ src }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlaying] = useState(false);
  const positionRef = useRef(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!wavesurfer.current) {
      const options = {
        container: waveformRef.current,
        waveColor: "#999999",
        progressColor: "#5577ff",
        cursorColor: "transparent",
        barWidth: 3,
        barRadius: 3,
        height: 25,
        normalize: true,
        responsive: true,
        interact: false,
        cursorWidth: 0,
        backend: "MediaElement",
        width: "100%",
        minPxPerSec: 1,
        barMinHeight: 1,
      };

      wavesurfer.current = WaveSurfer.create(options);
      wavesurfer.current.load(src);

      wavesurfer.current.on("waveform-ready", () => {
        setDuration(wavesurfer.current.getDuration());
      });

      wavesurfer.current.on("ready", function () {
        if (!wavesurfer.current.drawer) return;
        const containerWidth = waveformRef.current.clientWidth;
        const duration = wavesurfer.current.getDuration();
        const waveWidth =
          (containerWidth / duration) * wavesurfer.current.getDuration() +
          (duration < 1 ? 100 : 0);
        const increasedContainerWidth = containerWidth;
        wavesurfer.current.drawer.setWidth(waveWidth, increasedContainerWidth);
      });

      wavesurfer.current.on("play", () => {
        setPlaying(true);
      });

      wavesurfer.current.on("pause", () => {
        setPlaying(false);
      });

      wavesurfer.current.on("stop", () => {
        setPlaying(false);
      });

      /*waveformRef.current.addEventListener("click", event => {
    const relativePosition = event.offsetX / waveformRef.current.clientWidth;
    wavesurfer.current.seekTo(relativePosition);
  });*/

      wavesurfer.current.on("seek", (position) => {
        if (position < 0) return;
        positionRef.current = position;
        setCurrentTime(position * wavesurfer.current.getDuration());
      });

      waveformRef.current.addEventListener("mousedown", (e) => {
        const duration = wavesurfer.current.getDuration();
        const position = e.offsetX / waveformRef.current.clientWidth;
        positionRef.current = duration * position;
        wavesurfer.current.seekTo(position);
        wavesurfer.current.play();
        waveformRef.current.addEventListener("mousemove", mousemove);
      });
      waveformRef.current.addEventListener("mouseup", (e) =>
        waveformRef.current.removeEventListener("mousemove", mousemove)
      );
      waveformRef.current.addEventListener("mouseleave", (e) =>
        waveformRef.current.removeEventListener("mousemove", mousemove)
      );

      const mousemove = (e) => {
        const duration = wavesurfer.current.getDuration();
        const position = e.offsetX / waveformRef.current.clientWidth;
        positionRef.current = duration * position;
        wavesurfer.current.seekTo(position);
      };
    }

    return () => {
      wavesurfer.current.destroy();
      wavesurfer.current = null;
    };
  }, [src]);

  const playPause = () => {
    if (playing) {
      wavesurfer.current.pause();
    } else {
      wavesurfer.current.play();
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = wavesurfer.current.getCurrentTime();
      setCurrentTime(currentTime);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /*
  const stop = () => {
    wavesurfer.current.stop();
  };*/

  return (
    <>
      <button
        id="customAudioWork"
        className="btn btn-light font-24"
        onClick={playPause}
      >
        {playing ? <PauseFill /> : <CaretRightFill />}
      </button>
      <div id="customAudio" style={{ flexGrow: 1 }}>
        <div id="customAudioBody">
          <div ref={waveformRef} style={{ padding: 0, margin: 0 }} />
        </div>
      </div>
      <div id="customAudioTime">
        <span>
          {formatTime(currentTime.toFixed(2))} /{" "}
          {formatTime(duration.toFixed(2))}
        </span>
      </div>
    </>
  );
};

export default AudioPlayer;
