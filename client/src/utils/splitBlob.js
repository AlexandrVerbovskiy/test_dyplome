async function splitBlob(blob, chunkSize, chunkType) {
    const arrayBuffer = await blob.arrayBuffer();
    const chunks = [];
    const totalChunks = Math.ceil(arrayBuffer.byteLength / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = start + chunkSize;
        const chunk = arrayBuffer.slice(start, end);
        chunks.push(new Blob([chunk], {
            type: chunkType
        }));
    }

    return chunks;
}

export default splitBlob;