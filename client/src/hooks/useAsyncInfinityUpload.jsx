import { useEffect, useState, useRef } from "react";

const useAsyncInfinityUpload = (functionToGetMore) => {
  const count = 8;
  const [elements, setElements] = useState({});
  const elementIds = useRef([]);
  const [canShowMore, setCanShowMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const getMoreElements = async () => {
    const savedIds = elementIds.current;
    if (!canShowMore || loading) return;

    setLoading(true);

    await functionToGetMore(
      { skippedIds: savedIds, count },
      (res) => {
        const gettedElements = res;

        if (gettedElements.length > 0) {
          setElements((prev) => {
            const newElems = { ...prev };
            gettedElements.forEach((elem) => (newElems[elem.id] = { ...elem }));
            return newElems;
          });

          gettedElements.forEach((elem) => {
            if (elementIds.current.includes(elem.id)) return;
            elementIds.current.push(elem.id);
          });
        } else {
          setCanShowMore(false);
        }

        setLoading(false);
      },
      (e) => {
        console.log(e);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    getMoreElements();
  }, []);

  return { elements, getMoreElements, elemIds: elementIds.current };
};

export default useAsyncInfinityUpload;
