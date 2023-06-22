function splitDataIntoChunks(data, chunkSize) {
    const base64Data = data.split(',')[1];
    const decodedData = atob(base64Data); // Розкодування Base64
    const totalChunks = Math.ceil(decodedData.length / chunkSize);
    const chunks = [];

    for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, decodedData.length);
        const chunk = decodedData.slice(start, end);
        chunks.push(chunk);
    }

    return chunks;
}

export default splitDataIntoChunks;