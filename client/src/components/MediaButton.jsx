import { useRecordingMediaType } from "../hooks";
import { MicFill, CameraVideoFill } from "react-bootstrap-icons";

const MediaButton = () => {
  const {
    recordingMediaType,
    changeRecordingMediaType
  } = useRecordingMediaType();

  const handleMenuClick = e=>{
    e.preventDefault();
    changeRecordingMediaType();
  }

  return (
    <div
      className="btn radius-1_2"
      onClick={e => console.log(e)}
      onContextMenu={handleMenuClick}
      id="recordMediaButton"
    >
      {recordingMediaType == "audio" && <MicFill />}
      {recordingMediaType == "video" && <CameraVideoFill />}
    </div>
  );
};

export default MediaButton;
