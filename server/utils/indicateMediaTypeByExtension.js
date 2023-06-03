function indicateMediaTypeByExtension(type) {
    if (["mp4", "webm", "ogg", "ogv"].includes(type)) return "video";
    if (["mp3", "wav", "aac", "m4a", "mpeg"].includes(type)) return "audio";
    if (["jpg", "jpeg", "png", "gif", "svg"].includes(type)) return "image";
    return "file";
}

module.exports = indicateMediaTypeByExtension;