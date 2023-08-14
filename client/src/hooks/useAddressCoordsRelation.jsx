import React, { useState } from "react";

import {
  fullAddressToString,
  getAddressByCoords,
  getCoordsByAddress
} from "../utils";

const useAddressCoordsRelation = () => {
  const [coords, setCoords] = useState({ value: null, error: null });
  const [address, setAddress] = useState({ value: "", error: null });

  const changeCoords = async coords => {
    setCoords({ value: coords, error: null });
    const address = await getAddressByCoords(coords);
    const strAddress = fullAddressToString(address);
    setAddress({ value: strAddress, error: null });
  };

  const changeAddress = async address => {
    setAddress({ value: address, error: null });
    const res = await getCoordsByAddress(address);
    setCoords({ value: res, error: null });
    setCoords({ value: { lat: 0, lng: 0 }, error: null });
  };

  const addressCoordsValidate = () => {
    let validated = true;
    if (!coords.value) {
      setAddress(prev => ({
        ...prev,
        error: "Without coordinates, the program cannot find tasks nearby"
      }));
      validated = false;
    }
    return validated;
  };

  return {
    coords: { value: coords.value, error: coords.error, change: changeCoords },
    address: { ...address, change: changeAddress },
    addressCoordsValidate
  };
};

export default useAddressCoordsRelation;
