import React, { useEffect } from "react";
import { setKey, fromLatLng, fromAddress } from "react-geocode";

const useMap = () => {
  useEffect(() => {
    //setKey("AIzaSyAbwv5P-iff_vVB7TpstiQ1RI1kvktza48");
    //setKey("AIzaSyA7invsVY2ADOAEuZ3w5eZQCe_Yu0QOF4w");
    //setKey("AIzaSyALYcsPh3unwjOuZ1aRDtQAHcz3DXMQVm4");
  }, []);

  const getAddressInfo = (elem) => {
    const info = {};
    const value = elem.long_name;

    switch (elem.types[0]) {
      case "street_number": {
        info.streetNumber = value;
        break;
      }
      case "route": {
        info.street = value;
        break;
      }
      case "locality": {
        info.city = value;
        break;
      }
      case "administrative_area_level_1": {
        info.oblast = value;
        break;
      }
      case "country": {
        info.country = value;
        break;
      }
      default:
        break;
    }
    return info;
  };

  const getAddressByCoords = async ({ lat, lng }) => {
    try {
      const res = await fromLatLng(lat, lng);

      const addressArray = res.results[0].address_components;

      if (!addressArray) throw new Error("Undefined coords");

      const info = {};
      addressArray.forEach((elem) => {
        const newObj = getAddressInfo(elem);
        Object.assign(info, newObj);
      });

      return info;
    } catch (err) {
      console.log(err.message);
      return "";
    }
  };

  const getCoordsByAddress = async (address) => {
    try {
      const res = await fromAddress(address);
      const coords = res.results[0].geometry.location;
      if (!coords) throw new Error("Undefined address");
      return coords;
    } catch (error) {
      return null;
    }
  };

  const fullAddressToString = (address) => {
    let res = [];
    Object.keys(address).forEach((key) => res.push(address[key]));
    return res.join(", ");
  };

  return { getAddressByCoords, getCoordsByAddress, fullAddressToString };
};

export default useMap;
