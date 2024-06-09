export { default as axios } from "./axios";

export { default as generateSmilesArray } from "./generateSmilesArray";

export { default as getCursorPosition } from "./getCursorPosition";

export { default as getFileData } from "./getFileData";

export { default as randomString } from "./randomString";

export * from "./writerMedia";

export { default as splitBlob } from "./splitBlob";

export { default as isRangeInDocument } from "./isRangeInDocument";

export { default as splitDataIntoChunks } from "./splitDataIntoChunks";

export * from "./convertToBlob";

export { default as firstToLower } from "./firstToLower";

export { default as generateFullUserImgPath } from "./generateFullUserImgPath";

export { default as sortCountByMonths } from "./sortCountByMonths";

export { default as generatePagination } from "./generatePagination";

export { default as calculateFee } from "./calculateFee";

export { default as getQueryParams } from "./getQueryParams";

export * from "./dateHelpers";

export * from "./notification";

export { default as indicateMediaTypeByExtension } from "./indicateMediaTypeByExtension";

export { default as chartHelpers } from "./chartHelpers";

export const hasDuplicateIds = (arr, key) => {
  const idMap = {};
  for (const item of arr) {
    if (idMap[item[key]]) {
      return true;
    }
    idMap[item[key]] = true;
  }
  return false;
};

export const removeDuplicatesAndSort = (arr, key) => {
  const idMap = new Map();

  arr.forEach((item) => {
    if (
      !idMap.has(item[key]) ||
      idMap.get(item[key]).timeSended < item.timeSended
    ) {
      idMap.set(item[key], item);
    }
  });

  return Array.from(idMap.values()).sort((a, b) => b.timeSended - a.timeSended);
};
