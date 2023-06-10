const config = {
    API_URL: "http://localhost:5000",
    VIDEO_EXTENSIONS: ["mp4", "webm", "ogg", "ogv"],
    AUDIO_EXTENSIONS: ["mp3", "wav", "aac", "m4a", "mpeg"],
    IMAGE_EXTENSIONS: ["jpg", "jpeg", "png", "gif", "svg"],
    BLOB_CHUNK_SIZE: 200 * 1024,
    MAP_DEFAULT: {
        center: {
            lat: 44.076613,
            lng: -98.362239833
        },
        height: "100%",
        width: "100%",
    }
};

export default config;