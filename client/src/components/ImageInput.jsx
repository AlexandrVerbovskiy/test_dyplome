import { useState, useEffect, useRef } from "react";
import { getFileData } from "../utils";
import ErrorSpan from "./ErrorSpan";

const ImageInput = ({ btnText, onChange, error }) => {
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const inputRef = useRef(null);

  useEffect(
    () => {
      if (file) getFileData(file, setImg);
    },
    [file]
  );

  useEffect(() => onChange(img), [img]);

  const handleButtonClick = () => inputRef.current.click();

  const handleDrop = e => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) setFile(file);
  };

  const handleDragEnter = e => e.preventDefault();

  const handleDragOver = e => e.preventDefault();

  const handleDragLeave = e => e.preventDefault();

  return (
    <div className="form-group" id="avatarInput">
      <div className="d-flex">
        <input
          ref={inputRef}
          type="file"
          className="form-control"
          name="image"
          accept="image/*"
          onChange={e => setFile(e.target.files[0])}
        />
        <div
          className="image-input-btn-block"
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <button onClick={handleButtonClick} className="btn btn-light">
            {img
              ? <img
                  src={img.src}
                  alt={img.name}
                  height="170"
                  width="170"
                  className="small-img"
                />
              : btnText}
          </button>
        </div>
      </div>

      <ErrorSpan error={error} />
    </div>
  );
};

export default ImageInput;
