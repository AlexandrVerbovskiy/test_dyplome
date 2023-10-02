import { useEffect, useState, useRef } from "react";

const useAsyncInfinityUpload = (functionToGetMore) => {
  const count = 8;
  const [elements, setElements] = useState({});
  const elementIds = useRef([]);
  const [canShowMore, setCanShowMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const filterValue = useRef("");

  const onGetJobs = (res) => {
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
  };

  const getMoreElements = async () => {
    const savedIds = elementIds.current;
    if (!canShowMore || loading) return;

    setLoading(true);

    await functionToGetMore(
      { skippedIds: savedIds, count, filter: filterValue.current },
      (res) => {
        onGetJobs(res);
      },
      (e) => {
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    console.log("inited");
    getMoreElements();
  }, []);

  const setFilterValue = async (value) => {
    filterValue.current = value;
    setLoading(true);
    elementIds.current = [];

    await functionToGetMore(
      { skippedIds: [], count, filter: filterValue.current },
      (res) => {
        onGetJobs(res);
      },
      (e) => {
        setLoading(false);
      }
    );
  };

  return {
    elements,
    getMoreElements,
    elemIds: elementIds.current,
    filterValue: filterValue.current,
    setFilterValueChange: setFilterValue,
  };
};

export default useAsyncInfinityUpload;
