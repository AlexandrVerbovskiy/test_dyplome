import CONFIG from "../config";

const indicateMediaTypeByExtension = (type) => {
    if (CONFIG.VIDEO_EXTENSIONS.includes(type.toLowerCase())) return "video";
    if (CONFIG.AUDIO_EXTENSIONS.includes(type.toLowerCase())) return "audio";
    if (CONFIG.IMAGE_EXTENSIONS.includes(type.toLowerCase())) return "image";
    return "file";
}

export default indicateMediaTypeByExtension;