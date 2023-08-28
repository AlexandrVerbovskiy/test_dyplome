const config = {
    API_URL: "http://localhost:5000",
    VIDEO_EXTENSIONS: ["mp4", "avi", "mov", "wmv", "flv", "mkv", "mpg", "mpeg", "3gp", "swf"],
    AUDIO_EXTENSIONS: ["mp3", "wav", "ogg", "aac", "wma", "flac", "m4a", "ac3", "aiff", "au", "mid", "midi"],
    IMAGE_EXTENSIONS: ["jpg", "jpeg", "png", "gif", "bmp", "ico", "svg", "tif", "tiff", "webp"],
    BLOB_CHUNK_SIZE: 200 * 1024,
    UNBLOB_CHUNK_SIZE: 1024 * 1024,
    MAP_DEFAULT: {
        center: {
            lat: 44.076613,
            lng: -98.362239833
        },
        height: "100%",
        width: "100%",
    },
    FILE_ACCEPT: ".txt, .doc, .docx, .pdf, .xls, .xlsx, .ppt, .pptx, .jpg, .jpeg, .png, .gif, .mp3, .wav, .mp4, .avi, .mov, .csv, .html, .css, .js, .xml, .json, .svg, .bmp, .ico, .tif, .tiff, .psd, .ai, .eps, .wmv, .flv, .mkv, .ogg, .aac, .wma, .flac, .exe, .dll, .bat, .cmd, .apk, .jar, .cpp, .c, .java, .py, .php, .html, .htm, .asp, .aspx, .jsp, .rb, .pl, .sql, .db, .bak, .tar, .gz, .tgz, .deb, .rpm, .iso, .img, .dmg, .swf, .mpg, .mpeg, .3gp, .wmv, .mov, .ogg, .m4a, .aac, .ac3, .aiff, .au, .mid, .midi, .wma, .rtf, .odt, .ods, .odp, .odg, .odf, .log, .yaml, .m3u, .pls, .log, .ini, .cfg, .inf, .nfo, .url, .torrent, .bak, .tmp, .tmp, .old, .temp, .part, .bak, .dmp, .crash, .swp, .srt, .sub, .ass, .vtt, .ttf, .otf, .woff, .woff2, .eot, .tsv, .webp",
    JOB_STATUSES: {
        pending: {
            color: "warning",
            text: "Pending",
            value: "pending"
        },
        rejected: {
            color: "danger",
            text: "Rejected",
            value: "rejected"
        },
        completed: {
            color: "sucess",
            text: "Completed",
            value: "completed"
        },
        inProgress: {
            color: "orange",
            text: "In Progress",
            value: "inProgress"
        },
        cancelled: {
            color: "secondary",
            text: "Cancelled",
            value: "cancelled"
        },
        awaitingExecutionConfirmation: {
            color: "primary",
            text: "Awaiting Execution Confirmation",
            value: "awaitingExecutionConfirmation"
        },
        awaitingCancellationConfirmation: {
            color: "info",
            text: "Awaiting Cancellation Confirmation",
            value: "awaitingCancellationConfirmation"
        }
    }
};

export default config;