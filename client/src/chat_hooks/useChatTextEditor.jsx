import { useState } from "react";

const useChatTextEditor = () => {
  const [editor, setEditor] = useState({ active: false });
  const activateTextEditor = position =>
    setEditor({ ...position, active: true });
  const removeTextEditor = () =>
    setEditor(prev => ({ ...prev, active: false }));

  return {
    editor,
    activateTextEditor,
    removeTextEditor
  };
};

export default useChatTextEditor;
