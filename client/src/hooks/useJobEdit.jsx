import React, { useState } from "react";
import useAddressCoordsRelation from "./useAddressCoordsRelation";

const useJobEdit = () => {
  const [title, setTitle] = useState({ value: "", error: null });
  const [price, setPrice] = useState({ value: 0, error: null });
  const [description, setDescription] = useState({ value: "", error: null });
  const { coords, address, addressCoordsValidate } = useAddressCoordsRelation();

  const changeTitle = title => {
    setTitle({ value: title, error: null });
  };

  const changePrice = price => {
    setPrice({ value: price, error: null });
  };

  const changeDescription = description => {
    setDescription({ value: description, error: null });
  };

  const validateJobEdit = () => {
    let validated = true;

    if (price.value <= 0) {
      setPrice(prev => ({
        ...prev,
        error: "Price cannot be less than or equal to zero"
      }));
      validated = false;
    }

    if (title.value.length < 2) {
      setTitle(prev => ({
        ...prev,
        error: "Title must be longer than 2 characters"
      }));
      validated = false;
    }

    if (description.value.length < 20) {
      setDescription(prev => ({
        ...prev,
        error: "Description must be longer than 20 characters"
      }));
      validated = false;
    }

    console.log(validated);

    validated = addressCoordsValidate() && validated;
    return validated;
  };

  return {
    coords: { ...coords },
    address: { ...address },
    title: { ...title, change: changeTitle },
    price: { ...price, change: changePrice },
    description: { ...description, change: changeDescription },
    validateJobEdit
  };
};

export default useJobEdit;
