import { useState, useEffect, useRef, useDebugValue } from "react";
import { getQueryParams } from "utils";

const usePagination = ({
  getItemsFunc,
  onError = null,
  getDopProps = null,
  defaultData = null,
  needInit = true,
  onSendRequest = null,
}) => {
  const isFirstRef = useRef(true);
  const isFirstDefaultDataRef = useRef(true);

  const countPagesRef = useRef(0);
  const countItemsRef = useRef(0);

  const [options, setOptions] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(null);
  const [orderType, setOrderType] = useState(null);
  const [filter, setFilter] = useState("");

  const [items, setItems] = useState([]);
  const [canMoveNextPage, setCanMoveNextPage] = useState(true);
  const [canMovePrevPage, setCanMovePrevPage] = useState(true);

  const [currentFrom, setCurrentFrom] = useState(0);
  const [currentTo, setCurrentTo] = useState(0);

  const updateStateByOption = (gotOptions) => {
    setOptions(gotOptions);
    setPage(gotOptions.page);
    setItemsPerPage(gotOptions.count);
    setOrder(gotOptions.order);
    setOrderType(gotOptions.orderType);
    setFilter(gotOptions.filter);

    const queryParams = {};
    const dopProps = getDopProps ? getDopProps() : null;

    if (dopProps) {
      Object.keys(dopProps).forEach((key) => {
        if (
          dopProps[key] &&
          dopProps[key].value &&
          (!dopProps[key].hidden || !dopProps[key].hidden(dopProps[key].value))
        ) {
          const queryName = dopProps[key].name ?? key;
          queryParams[queryName] = dopProps[key].value;
        }
      });
    }

    if (gotOptions.page > 1) {
      queryParams["page"] = gotOptions.page;
    }

    if (gotOptions.order) {
      queryParams["order"] = gotOptions.order;
      if (gotOptions.orderType) {
        queryParams["order-type"] = gotOptions.orderType;
      }
    }

    if (gotOptions.filter) {
      queryParams["filter"] = gotOptions.filter;
    }

    if (dopProps) {
      Object.keys(dopProps).forEach((key) => {
        let checkHidden = null;
        let paramName = key;

        Object.keys(dopProps).forEach((dopPropsKey) => {
          if (key === dopPropsKey || dopProps[key]?.name === dopPropsKey) {
            if (dopProps[dopPropsKey].hidden) {
              checkHidden = dopProps[dopPropsKey].hidden;
            }

            if (dopProps[dopPropsKey].name) {
              paramName = dopProps[dopPropsKey].name;
            }
          }
        });

        if (!checkHidden || !checkHidden(gotOptions[key])) {
          queryParams[paramName] = gotOptions[key];
        } else {
          if (queryParams[paramName]) {
            delete queryParams[paramName];
          }
        }
      });
    }

    const props = Object.keys(queryParams)
      .filter((param) => queryParams[param])
      .map((param) => {
        if (Array.isArray(queryParams[param])) {
          return queryParams[param].map((val) => `${param}=${val}`).join("&");
        } else {
          return `${param}=${queryParams[param]}`;
        }
      })
      .join("&");

    const currentLink = window.location.href;

    const newLinkPart =
      window.location.origin +
      window.location.pathname +
      (props ? `?${props}` : "");

    if (currentLink !== newLinkPart) {
      window.history.replaceState({ path: newLinkPart }, "", newLinkPart);
    }
  };

  const getFullProps = (dopBody = {}) => {
    let props = {
      clientTime: Date.now(),
      order,
      orderType,
      itemsPerPage,
      filter,
    };

    if (getDopProps) {
      const bodyPropsInfo = getDopProps();
      const bodyProps = {};
      Object.keys(bodyPropsInfo).forEach((key) => {
        const bodyName = bodyPropsInfo[key].key ?? key;
        bodyProps[bodyName] = bodyPropsInfo[key].value;
      });

      props = { ...props, ...bodyProps };
    }

    return { ...props, ...dopBody };
  };

  const onChangeOptions = async (dopBody = {}) => {
    try {
      const props = getFullProps(dopBody);
      const res = await getItemsFunc(props);

      const {
        options: gotOptions,
        items: gotItems,
        countItems: gotCountItems,
      } = res;

      countPagesRef.current = gotOptions.totalPages;
      countItemsRef.current = gotCountItems;
      updateStateByOption(gotOptions);
      setItems(gotItems);

      if (onSendRequest) {
        onSendRequest({ items: gotItems });
      }
    } catch (e) {
      if (onError) {
        onError(e);
      }
    }
  };

  useEffect(() => {
    if (!defaultData || isFirstDefaultDataRef.current) {
      isFirstDefaultDataRef.current = false;
      return;
    }

    if (defaultData) {
      const {
        options: gotOptions,
        items: gotItems,
        countItems: gotCountItems,
      } = defaultData;

      countPagesRef.current = gotOptions.totalPages;
      countItemsRef.current = gotCountItems;

      setOptions(gotOptions);
      setPage(gotOptions.page);
      setItemsPerPage(gotOptions.count);
      setOrder(gotOptions.order);
      setOrderType(gotOptions.orderType);
      setFilter(gotOptions.filter);

      setItems(gotItems);
    }
  }, [defaultData?.options]);

  useEffect(() => {
    const dopBody = {};

    const queryParams = getQueryParams();
    const { order, page, filter } = queryParams;
    const orderType = queryParams["order-type"];

    if (order) {
      dopBody["order"] = order;
    }

    if (orderType) {
      dopBody["orderType"] = orderType;
    }

    if (page) {
      dopBody["page"] = page;
    }

    if (filter) {
      dopBody["filter"] = filter;
    }

    if (isFirstRef.current) {
      isFirstRef.current = false;

      if (defaultData) {
        const {
          options: gotOptions,
          items: gotItems,
          countItems: gotCountItems,
        } = defaultData;

        countPagesRef.current = gotOptions.totalPages;
        countItemsRef.current = gotCountItems;
        updateStateByOption(gotOptions);
        setItems(gotItems);
      } else {
        if (needInit) {
          onChangeOptions(dopBody);
        }
      }
    } else {
      onChangeOptions(dopBody);
    }
  }, []);

  useEffect(() => {
    setCanMovePrevPage(page > 1);
    setCanMoveNextPage(page < countPagesRef.current);

    const from = Math.min((page - 1) * itemsPerPage + 1, countItemsRef.current);
    const to = Math.min(page * itemsPerPage, countItemsRef.current);

    setCurrentFrom(from);
    setCurrentTo(to);
  }, [page, countItemsRef.current, countPagesRef.current]);

  const handleChangeOrder = (selectedOrderName) => {
    let newOrder = null;
    let newType = null;

    if (order && order == selectedOrderName) {
      if (orderType == "desc") {
        newOrder = selectedOrderName;
        newType = "asc";
      }
    } else {
      newOrder = selectedOrderName;
      newType = "desc";
    }

    setOrder(newOrder);
    setOrderType(newType);
    onChangeOptions({ order: newOrder, orderType: newType });
  };

  const moveToPage = (number) => {
    if (number > countPagesRef.current) return;
    setPage(number);
    onChangeOptions({ page: number });
  };

  const changeFilter = (value) => {
    setFilter(value);
    setPage(1);
    onChangeOptions({ page: 1, filter: value });
  };

  const setItemFields = (itemInfo, itemId) => {
    setItems((prev) => {
      const res = [];

      prev.forEach((item) => {
        if (item.id === itemId) {
          res.push({ ...item, ...itemInfo });
        } else {
          res.push(item);
        }
      });

      return res;
    });
  };

  return {
    moveToPage,
    changeFilter,
    filter,
    order,
    orderType,
    handleChangeOrder,
    canMoveNextPage,
    canMovePrevPage,
    items,
    currentTo,
    currentFrom,
    page,
    countPages: countPagesRef.current,
    countItems: countItemsRef.current,
    rebuild: onChangeOptions,
    setItemFields,
    options,
  };
};

export default usePagination;
