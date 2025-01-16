const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const previousFrameCanvas = document.createElement("canvas");
const previousFrameCtx = previousFrameCanvas.getContext('2d', { willReadFrequently: true });

let previousFrame = null;
let frameCounter = 0;
const frameOffset = document.getElementById("frameOffset");
const invertColors = document.getElementById("invertColors");

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.play();
    }).catch(err => console.error("Error accessing webcam:", err));

function processFrame() {
    if (video.readyState !== 4) {
        requestAnimationFrame(processFrame);
        return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    previousFrameCanvas.width = video.videoWidth;
    previousFrameCanvas.height = video.videoHeight;

    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = frame.data;

    if (previousFrame) {
        let prevData = previousFrame.data;

        for (let i = 0; i < data.length; i += 4) {
            if (invertColors.checked) { // Constructive interference (AND)
                data[i] = data[i] & prevData[i]; // Red colorway
                data[i+1] = data[i+1] & prevData[i+1]; // Green colorway
                data[i+2] = data[i+2] & prevData[i+2]; // Blue colorway
            } else { // Destructive interference (XOR)
                data[i] = data[i] ^ prevData[i]; // Red colorway
                data[i+1] = data[i+1] ^ prevData[i+1]; // Green colorway
                data[i+2] = data[i+2] ^ prevData[i+2]; // Blue colorway
            }
        }

        ctx.putImageData(frame, 0, 0);
        frameCounter += 1;
    }

    if (frameCounter % frameOffset.value == 0) {
        previousFrameCtx.drawImage(video, 0, 0, previousFrameCanvas.width, previousFrameCanvas.height);
        previousFrame = previousFrameCtx.getImageData(0, 0, previousFrameCanvas.width, previousFrameCanvas.height);
        frameCounter = 0;
    }
        requestAnimationFrame(processFrame);
}

video.addEventListener('loadedmetadata', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    previousFrameCanvas.width = video.videoWidth;
    previousFrameCanvas.height = video.videoHeight;
    
    requestAnimationFrame(processFrame);
});