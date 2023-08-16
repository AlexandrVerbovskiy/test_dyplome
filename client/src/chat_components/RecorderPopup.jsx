import { useContext } from "react";
import { StopFill } from "react-bootstrap-icons";
import { PopupWrapper } from "../components";
import { ChatBodyContext } from "../contexts";
import { formatTime } from "../utils";
import VisualizeCamera from "./VisualizeCamera";
import VisualizeAudio from "./VisualizeAudio";

const RecorderPopup = () => {
  const { recorder } = useContext(ChatBodyContext);
  const {
    active,
    recordingTime,
    close,
    stop,
    recording,
    handleStartRecording,
    recordingMediaType
  } = recorder;

  const onStopClick = () => {
    stop();
    console.log("stopped");
    close();
  };

  return (
    <PopupWrapper
      onClose={close}
      activeTrigger={active}
      id="Recording"
      title="Recording"
    >
      <div className="modal-body">
        <div className="card">
          <div className="card-body d-flex justify-content-center">
            {recordingMediaType == "video" &&
              <VisualizeCamera
                active={active}
                handlePlay={handleStartRecording}
              />}
            {recordingMediaType == "audio" &&
              <VisualizeAudio
                active={active}
                handlePlay={handleStartRecording}
              />}
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <div className="recording-block">
          <div className="time-section">
            <div className={"circle" + (recording ? " active" : "")} />
            <span>
              {formatTime(recordingTime)}
            </span>
          </div>
          <StopFill onClick={onStopClick} />
        </div>
      </div>
    </PopupWrapper>
  );
};

export default RecorderPopup;
