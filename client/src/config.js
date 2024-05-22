const config = {
  API_URL: "http://localhost:5000",
  CLIENT_URL: "http://localhost:3000",
  VIDEO_EXTENSIONS: [
    "mp4",
    "avi",
    "mov",
    "wmv",
    "flv",
    "mkv",
    "mpg",
    "mpeg",
    "3gp",
    "swf",
  ],
  AUDIO_EXTENSIONS: [
    "mp3",
    "wav",
    "ogg",
    "aac",
    "wma",
    "flac",
    "m4a",
    "ac3",
    "aiff",
    "au",
    "mid",
    "midi",
  ],
  IMAGE_EXTENSIONS: [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "ico",
    "svg",
    "tif",
    "tiff",
    "webp",
  ],
  BLOB_CHUNK_SIZE: 200 * 1024,
  UNBLOB_CHUNK_SIZE: 1024 * 1024,
  MAP_DEFAULT: {
    center: {
      lat: 50.2136832,
      lng: 28.655616,
    },
    height: "100%",
    width: "100%",
  },
  RADIUS_DEFAULT: 1000,
  FILE_ACCEPT:
    ".txt, .doc, .docx, .pdf, .xls, .xlsx, .ppt, .pptx, .jpg, .jpeg, .png, .gif, .mp3, .wav, .mp4, .avi, .mov, .csv, .html, .css, .js, .xml, .json, .svg, .bmp, .ico, .tif, .tiff, .psd, .ai, .eps, .wmv, .flv, .mkv, .ogg, .aac, .wma, .flac, .exe, .dll, .bat, .cmd, .apk, .jar, .cpp, .c, .java, .py, .php, .html, .htm, .asp, .aspx, .jsp, .rb, .pl, .sql, .db, .bak, .tar, .gz, .tgz, .deb, .rpm, .iso, .img, .dmg, .swf, .mpg, .mpeg, .3gp, .wmv, .mov, .ogg, .m4a, .aac, .ac3, .aiff, .au, .mid, .midi, .wma, .rtf, .odt, .ods, .odp, .odg, .odf, .log, .yaml, .m3u, .pls, .log, .ini, .cfg, .inf, .nfo, .url, .torrent, .bak, .tmp, .tmp, .old, .temp, .part, .bak, .dmp, .crash, .swp, .srt, .sub, .ass, .vtt, .ttf, .otf, .woff, .woff2, .eot, .tsv, .webp",
  JOB_STATUSES: {
    pending: {
      color: "warning",
      text: "Pending",
      value: "Pending",
    },
    rejected: {
      color: "danger",
      text: "Rejected",
      value: "Rejected",
    },
    completed: {
      color: "success",
      text: "Completed",
      value: "Completed",
    },
    inProgress: {
      color: "orange",
      text: "In Progress",
      value: "In Progress",
    },
    cancelled: {
      color: "secondary",
      text: "Cancelled",
      value: "Cancelled",
    },
    awaitingExecutionConfirmation: {
      color: "primary",
      text: "Awaiting Execution Confirmation",
      value: "Awaiting Execution Confirmation",
    },
    awaitingCancellationConfirmation: {
      color: "secondary",
      text: "Cancelled Confirmation",
      value: "Awaiting Cancellation Confirmation",
    },
  },
  DISPUTE_STATUSES: {
    pending: {
      color: "danger",
      text: "Pending",
      value: "Pending",
    },
    inProgress: {
      color: "warning",
      text: "In Progress",
      value: "In Progress",
    },
    resolved: {
      color: "success",
      text: "Resolved",
      value: "Resolved",
    },
  },
  MESSAGES_UPLOAD_COUNT: 20,
  MONTH_NAMES: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  COMMENT_TYPES: {
    employee: "employee",
    worker: "worker",
    job: "job",
  },
  CHAT_ROLES: {
    owner: "Owner",
    admin: "Admin",
    member: "Member",
  },
  CHAT_OWNER_ROLES_SELECT: [
    { value: "member", title: "Member" },
    { value: "admin", title: "Admin" },
  ],
  CHAT_ADMIN_ROLES_SELECT: [{ value: "member", title: "Member" }],
  STRIPE_PUBLIC_KEY:
    "pk_test_51Mq9NRJOCxSbJmWptiojgsHHhJMLSJmu6QWEXD0g39q6FEEXEZrcdYIxTHj6xkVFEylGbNgjLr3CghO6G4hsndAR00ftyUUUoh",
  PAYPAL_CLIENT_ID:
    "AQ5Tt3LwAhkLeJLwzex9HsYTD-BeIiHwQoqLnDcGsvQsDV4GjbNmSb6IcE6e9L6i9Lx0WuQzlGJ6Hu-q",
};

export default config;
