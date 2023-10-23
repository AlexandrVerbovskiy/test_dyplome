import React, { useEffect, useState, useRef } from "react";

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

  const resetElements = async () => {
    setLoading(true);
    elementIds.current = [];
    setElements([]);

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

  const setFilterValue = async (value) => {
    filterValue.current = value;
    await resetElements();
  };

  return {
    elements,
    getMoreElements,
    elemIds: elementIds.current,
    filterValue: filterValue.current,
    setFilterValueChange: setFilterValue,
    resetElements,
  };
};

export default useAsyncInfinityUpload;
