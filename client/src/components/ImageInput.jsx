import React, { useState, useEffect, useRef } from "react";
import { getFileData } from "utils";
import ErrorSpan from "./ErrorSpan";
import config from "config";

const ImageInput = ({ btnText, onChange, error, url = null, id = null }) => {
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (typeof url == "string") {
      setImg({ src: config.API_URL + "/" + url, name: "profile-avatar" });
    } else {
      setImg(url);
    }
  }, [url]);

  useEffect(() => {
    if (file)
      getFileData(file, (img) => {
        setImg(img);
        onChange(img);
      });
  }, [file]);

  const handleButtonClick = () => inputRef.current.click();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) setFile(file);
  };

  const handleDragEnter = (e) => e.preventDefault();

  const handleDragOver = (e) => e.preventDefault();

  const handleDragLeave = (e) => e.preventDefault();

  return (
    <div className="form-group" id={id}>
      <div className="d-flex">
        <input
          ref={inputRef}
          type="file"
          className="form-control"
          name="image"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <div
          className="image-input-btn-block"
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <button onClick={handleButtonClick} className="btn btn-light">
            {img ? (
              <img
                src={img.src}
                alt={img.name}
                height="170"
                width="170"
                className="small-img"
              />
            ) : (
              btnText
            )}
          </button>
        </div>
      </div>

      <ErrorSpan error={error} />
    </div>
  );
};

export default ImageInput;
