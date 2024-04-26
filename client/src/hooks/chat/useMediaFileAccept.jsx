import React, { useState } from "react";

const useMediaFileAccept = () => {
  const [file, setFile] = useState(null);
  const [active, setActive] = useState(false);
  const close = () => setActive(false);
  const open = () => setActive(true);

  const handleSetFile = (newFile) => {
    setFile(newFile);
    setActive(true);
    open();
  };

  return { file, handleSetFile, open, close, active };
};

export default useMediaFileAccept;
