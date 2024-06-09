const isRangeInDocument = (startContainer, endContainer) => {
  const rootElement = document.documentElement || document.body;
  const isStartContainerInDocument = rootElement.contains(startContainer);
  const isEndContainerInDocument = rootElement.contains(endContainer);
  const isInRange = isStartContainerInDocument && isEndContainerInDocument;
  return isInRange;
};

export default isRangeInDocument;