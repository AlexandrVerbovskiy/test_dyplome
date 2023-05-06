const getMedia = async (constraints) => {
    let stream = null;
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
        console.log(err.name + ": " + err.message);
    }
    return stream;
}

let voice = [];
let mediaRecorder = null;

export const startRecording = async (mediaType, afterStartRecording, afterRecording) => {
    let resBlob = null;
    const constraints = {
        audio: true
    };
    if (mediaType === "video")
        constraints["video"] = true;

    const stream = await getMedia(constraints);
    if (stream === null)
        return

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    afterStartRecording();

    mediaRecorder.addEventListener("dataavailable", async event => {
        voice = [];
        voice.push(event.data);
    });

    mediaRecorder.addEventListener("stop", () => {
        stream.getTracks().forEach((track) => track.stop());

        if (mediaType !== "video") {
            const voiceBlob = new Blob(voice, {
                type: 'audio/mp3'
            });
            resBlob = voiceBlob;
        } else {
            const videoBlob = new Blob(voice, {
                type: 'video/mp4'
            });
            resBlob = videoBlob;
        }

        afterRecording(resBlob);
    });

    const stopper = () => {
        mediaRecorder.stop();
        mediaRecorder = null;
    }

    return stopper;
}