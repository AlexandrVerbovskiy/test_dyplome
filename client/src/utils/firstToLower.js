const firstToLower = (string) => {
  if (string.length === 0) {
    return string;
  }

  return string[0].toLowerCase() + string.slice(1);
};

export default firstToLower;
