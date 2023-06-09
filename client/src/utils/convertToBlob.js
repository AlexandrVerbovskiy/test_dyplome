export async function blobLinkToBlob(blobURL) {
    const res = await fetch(blobURL);
    const blob = await res.blob();
    return blob;
}

export async function base64ToBlob(base64Data) {
    const [, imageType] = base64Data.match(/^data:([\w\/]+);base64,/);
    const base64WithoutPrefix = base64Data.slice(base64Data.indexOf(',') + 1);
    const byteCharacters = atob(base64WithoutPrefix);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
        type: imageType
    });
    return blob;
}

export async function notMediaParts(data) {
    return data;
}

export async function autoConvert(data) {
    if (data.includes("blob:http")) {
        const res = await blobLinkToBlob(data);
        return {
            data: res,
            dataType: "media"
        };
    }
    //if (data.includes("data:") && data.includes("base64")) return base64ToBlob(data);
    if (data.match(/^data:([\w\/]+);base64,/)) {
        const res = await base64ToBlob(data);
        return {
            data: res,
            dataType: "media"
        };
    }

    const res = await notMediaParts(data);
    return {
        data: res,
        dataType: "notmedia"
    };
}