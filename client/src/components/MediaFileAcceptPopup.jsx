import { useContext } from "react";
import PopupWrapper from "./PopupWrapper";
import CustomAudio from "./CustomAudio";
import { ChatBodyContext } from "../contexts";
import config from "../config";

const MediaFileAcceptPopup = () => {
  const { mediaFileAccept } = useContext(ChatBodyContext);
  const { file, active, close } = mediaFileAccept;

  const handleSendFile = () => {
    console.log(file);
  };

  const ImgToSend = () => {
    return <img src={file.src} className="d-block w-100" alt="..." />;
  };

  const VideoToSend = ({ type }) => {
    return (
      <video controls>
        <source src={file.src} type={"video/" + type} />
        Your browser does not support the video tag.
      </video>
    );
  };

  const AudioToSend = () => {
    return <CustomAudio src={file.src} />;
  };

  const FileToSend = () => {
    return (
      <div>
        Name: {file.name}
      </div>
    );
  };

  const checkFileExtension = extension => {
    if (!file || !file.type || !file.name) return false;

    const fullExtension = "." + extension;
    const splitedExtension = file.name.split(fullExtension);

    if (splitedExtension.length < 2) return false;
    if (splitedExtension[splitedExtension.length - 1].length > 0) return false;
    return true;
  };

  const checkIsFileHasExtension = extensions => {
    let has = false;
    extensions.forEach(extension => {
      if (checkFileExtension(extension)) has = extension;
    });
    return has;
  };

  const FileCard = () => {
    let FileElem = FileToSend;

    if (checkIsFileHasExtension(config.IMAGE_EXTENSIONS)) FileElem = ImgToSend;

    const hasVideoType = checkIsFileHasExtension(config.VIDEO_EXTENSIONS);
    if (hasVideoType) FileElem = () => <VideoToSend type={hasVideoType} />;

    if (checkIsFileHasExtension(config.AUDIO_EXTENSIONS))
      FileElem = AudioToSend;

    return (
      <div className="card">
        <div className="card-body d-flex justify-content-center">
          <FileElem />
        </div>
      </div>
    );
  };

  if (!active) return;
  return (
    <PopupWrapper
      onClose={close}
      activeTrigger={active}
      id="chatMediaFileAccept"
      title="Are you sure you want to send this video?"
    >
      <div className="modal-body">
        {file && <FileCard />}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={close}>
          Close
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSendFile}
        >
          Send
        </button>
      </div>
    </PopupWrapper>
  );
};

export default MediaFileAcceptPopup;
