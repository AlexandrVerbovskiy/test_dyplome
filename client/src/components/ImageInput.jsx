import { useState, useEffect, useRef } from "react";
import { getFileData } from "../utils";

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

  return (
    <div className="form-group" id="exampleForm.ControlInput1">
      <div className="d-flex">
        <input
          ref={inputRef}
          type="file"
          className="form-control"
          onChange={e => setFile(e.target.files[0])}
        />
        <div className="image-input-btn-block">
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

      {error &&
        <span className="form-text text-danger">
          {error}
        </span>}
    </div>
  );
};

export default ImageInput;
