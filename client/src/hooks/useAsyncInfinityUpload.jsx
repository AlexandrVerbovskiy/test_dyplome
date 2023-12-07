import React, { useEffect, useState, useRef, useContext } from "react";
import { MainContext } from "../contexts";

const useAsyncInfinityUpload = (functionToGetMore, count = 8) => {
  const [elements, setElements] = useState({});
  const elementIds = useRef([]);
  const [canShowMore, setCanShowMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const filterValue = useRef("");
  const main = useContext(MainContext);

  const onGetEntities = (res) => {
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

    try {
      const res = await main.request({
        url: functionToGetMore.url(),
        data: { skippedIds: savedIds, count, filter: filterValue.current },
        type: functionToGetMore.type,
        convertRes: functionToGetMore.convertRes ?? null,
      });
      onGetEntities(res);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMoreElements();
  }, []);

  const resetElements = async () => {
    setLoading(true);
    elementIds.current = [];
    setElements({});

    try {
      const res = await main.request({
        url: functionToGetMore.url(),
        data: { skippedIds: [], count, filter: filterValue.current },
        type: functionToGetMore.type,
        convertRes: functionToGetMore.convertRes ?? {},
      });
      onGetEntities(res);
    } catch (e) {
      setLoading(false);
    }
  };

  const setFilterValue = async (value) => {
    filterValue.current = value;
    await resetElements();
  };

  const prependElement = (element) =>
    setElements((prev) => {
      prev[element.id] = { ...element };
      return { ...prev };
    });

  return {
    elements,
    getMoreElements,
    elemIds: elementIds.current,
    filterValue: filterValue.current,
    setFilterValueChange: setFilterValue,
    resetElements,
    prependElement,
  };
};

export default useAsyncInfinityUpload;
