import { useContext } from "react";
import { MicFill, CameraVideoFill } from "react-bootstrap-icons";
import { ChatBodyContext } from "../contexts";

const MediaButton = () => {
  const { recorder } = useContext(ChatBodyContext);
  const { recordingMediaType, changeRecordingMediaType, open } = recorder;

  const handleMenuClick = e => {
    e.preventDefault();
    changeRecordingMediaType();
  };

  return (
    <div
      className="btn radius-1_2"
      onClick={open}
      onContextMenu={handleMenuClick}
      id="recordMediaButton"
    >
      {recordingMediaType == "audio" && <MicFill />}
      {recordingMediaType == "video" && <CameraVideoFill />}
    </div>
  );
};

export default MediaButton;
