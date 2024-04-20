import React, { useState, useEffect } from "react";

import useMap from "./useMap";
import config from "config";

const useAddressCoordsRelation = () => {
  const { fullAddressToString, getAddressByCoords, getCoordsByAddress } =
    useMap();

  const [coords, setCoords] = useState({ value: null, error: null });
  const [address, setAddress] = useState({ value: "", error: null });

  const changeCoords = async (coords) => {
    setCoords({ value: coords, error: null });
    const address = await getAddressByCoords(coords);
    const strAddress = fullAddressToString(address);
    setAddress({ value: strAddress, error: null });
  };

  const changeAddress = async (address) => {
    setAddress({ value: address, error: null });
    const res = await getCoordsByAddress(address);

    if (res) {
      setCoords({ value: res, error: null });
    } else {
      setCoords({ value: config.MAP_DEFAULT.center, error: null });
    }
  };

  const addressCoordsValidate = () => {
    let validated = true;
    if (!coords.value) {
      setAddress((prev) => ({
        ...prev,
        error: "Without coordinates, the program cannot find tasks nearby",
      }));
      validated = false;
    }
    return validated;
  };

  return {
    coords: {
      value: coords.value,
      error: coords.error,
      change: changeCoords,
      set: (value) => setCoords({ value, error: null }),
    },
    address: {
      ...address,
      change: changeAddress,
      set: (value) => setAddress({ value, error: null }),
    },
    addressCoordsValidate,
  };
};

export default useAddressCoordsRelation;
