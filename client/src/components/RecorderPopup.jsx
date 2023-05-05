import { useContext } from "react";
import { StopFill } from "react-bootstrap-icons";
import PopupWrapper from "./PopupWrapper";
import { ChatBodyContext } from "../contexts";
import { formatTime } from "../utils";

const RecorderPopup = () => {
  const { recorder } = useContext(ChatBodyContext);
  const { active, recordingTime, close, stop, recording } = recorder;
  const onStopClick = () => {
    stop();
    console.log("stopped");
  };

  return (
    <PopupWrapper
      onClose={close}
      activeTrigger={active}
      id="chatMediaFileAccept"
      title="Recording"
    >
      <div className="recording-block">
        <div className="time-section">
          <div className={"circle" + (recording ? " active" : "")} />
          <span>
            {formatTime(recordingTime)}
          </span>
        </div>
        <StopFill onClick={onStopClick} />
      </div>
    </PopupWrapper>
  );
};

export default RecorderPopup;
