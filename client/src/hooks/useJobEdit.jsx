import React, { useState, useEffect, useContext } from "react";
import useAddressCoordsRelation from "./useAddressCoordsRelation";
import { getJobInfo } from "../requests";
import { MainContext } from "../contexts";

const useJobEdit = ({ id = null }) => {
  const [jobId, setJobId] = useState(id);
  const [title, setTitle] = useState({ value: "", error: null });
  const [price, setPrice] = useState({ value: 0, error: null });
  const [description, setDescription] = useState({ value: "", error: null });
  const { coords, address, addressCoordsValidate } = useAddressCoordsRelation();
  const main = useContext(MainContext);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await main.request({
          url: getJobInfo.url(id),
          type: getJobInfo.type,
          convertRes: getJobInfo.convertRes,
        });

        if (!res) return;

        coords.change({ lat: res.lat, lng: res.lng });
        address.change(res.address);

        changePrice(res.price);
        changeTitle(res.title);
        changeDescription(res.description);
      } catch (e) {}
    })();
  }, []);

  const changeJobId = (id) => {
    setJobId(id);
  };

  const changeTitle = (title) => {
    setTitle({ value: title, error: null });
  };

  const changePrice = (price) => {
    setPrice({ value: price, error: null });
  };

  const changeDescription = (description) => {
    setDescription({ value: description, error: null });
  };

  const validateJobEdit = () => {
    let validated = true;

    if (price.value <= 0) {
      setPrice((prev) => ({
        ...prev,
        error: "Price cannot be less than or equal to zero",
      }));
      validated = false;
    }

    if (title.value.length < 2) {
      setTitle((prev) => ({
        ...prev,
        error: "Title must be longer than 2 characters",
      }));
      validated = false;
    }

    if (description.value.length < 20) {
      setDescription((prev) => ({
        ...prev,
        error: "Description must be longer than 20 characters",
      }));
      validated = false;
    }

    validated = addressCoordsValidate() && validated;
    return validated;
  };

  return {
    coords: { ...coords },
    address: { ...address },
    title: { ...title, change: changeTitle },
    price: { ...price, change: changePrice },
    description: { ...description, change: changeDescription },
    jobId: { value: jobId, change: changeJobId },
    validateJobEdit,
  };
};

export default useJobEdit;
