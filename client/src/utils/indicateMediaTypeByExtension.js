import CONFIG from "../config";

const indicateMediaTypeByExtension = (type) => {
    if (CONFIG.VIDEO_EXTENSIONS.includes(type)) return "video";
    if (CONFIG.AUDIO_EXTENSIONS.includes(type)) return "audio";
    if (CONFIG.IMAGE_EXTENSIONS.includes(type)) return "image";
    return "file";
}

export default indicateMediaTypeByExtension;