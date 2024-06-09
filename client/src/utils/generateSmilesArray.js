const generateSmilesArray = () => {
    const arrByHexSystem = (arr, actual, end) => {
        arr.push(actual);
        if (parseInt(actual, 16) === parseInt(end, 16))
            return;
        const newActual = (parseInt(actual, 16) + 1).toString(16);
        arrByHexSystem(arr, newActual, end);
    }

    const arr = [];
    arrByHexSystem(arr, "1F600", "1F644");
    arrByHexSystem(arr, "1F910", "1F915");
    arrByHexSystem(arr, "1F920", "1F925");
    arrByHexSystem(arr, "1F927", "1F92F");
    arr.push("1F9D0");
    return arr;
}

export default generateSmilesArray;