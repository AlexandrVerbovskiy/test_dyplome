function indicateMediaTypeByExtension(type) {
    if (["mp4", "webm", "ogg", "ogv"].includes(type.toLowerCase())) return "video";
    if (["mp3", "wav", "aac", "m4a", "mpeg"].includes(type.toLowerCase())) return "audio";
    if (["jpg", "jpeg", "png", "gif", "svg"].includes(type.toLowerCase())) return "image";
    return "file";
}

module.exports = indicateMediaTypeByExtension;