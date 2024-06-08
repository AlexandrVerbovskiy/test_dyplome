import config from "_config";

const indicateMediaTypeByExtension = (type) => {
    if (config.VIDEO_EXTENSIONS.includes(type.toLowerCase())) return "video";
    if (config.AUDIO_EXTENSIONS.includes(type.toLowerCase())) return "audio";
    if (config.IMAGE_EXTENSIONS.includes(type.toLowerCase())) return "image";
    return "file";
}

export default indicateMediaTypeByExtension;