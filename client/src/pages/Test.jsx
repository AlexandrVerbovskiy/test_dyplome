import { useState } from "react";
import { useMap } from "../hooks";
const Test = () => {
  const [address, setAddress] = useState("");
  const { getAddressByCoords, getCoordsByAddress, fullAddressToString } =
    useMap();

  const changeAddress = async (value) => {
    console.log(value);
    const res = await getCoordsByAddress(value);
    console.log(res);
  };

  return (
    <input
      type="text"
      value={address}
      onInput={(e) => setAddress(e.target.value)}
      onChange={(e) => changeAddress(e.target.value)}
    />
  );
};

export default Test;
