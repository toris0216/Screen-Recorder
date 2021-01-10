const inputVideo = document.getElementById('input-video');
const outputVideo = document.getElementById('output-video');
const recordVideo = document.getElementById('record-video');
var constraints = { 
    video: { 
        width: 800,
        length: 600
    }
};

let myScreenStream;
let myAudioStream;
let recordStream = new MediaStream();
let mediaRecorder;

navigator.mediaDevices.getDisplayMedia(constraints)
.then(stream => {
    myScreenStream = stream;
    inputVideo.srcObject = stream;
    inputVideo.addEventListener('loadedmetadata', () => {
        inputVideo.play();
    })
})

navigator.mediaDevices.getUserMedia({
    audio: true
}).then(stream => {
    myAudioStream = stream;
})

let outputVideoURL;

const startRecord = () => {
    let video_track_from_stream = myScreenStream.getVideoTracks()[0];
    recordStream.addTrack(video_track_from_stream);

    let audio_track_from_stream = myAudioStream.getAudioTracks()[0];
    recordStream.addTrack(audio_track_from_stream);
    
    mediaRecorder = new MediaRecorder(recordStream, {
        mimeType: 'video/webm;codecs=VP9',
        // bitsPerSecond: '512000',
    })
    mediaRecorder.start();
    console.log('Start Recording.');
}

const stopRecord = () => {
    mediaRecorder.stop();
    console.log('Stop Recording.');
    let chunks = [];
    mediaRecorder.addEventListener('dataavailable', mediaRecorderOnDataAvailable)
    mediaRecorder.addEventListener('stop', mediaRecorderOnStop)
    function mediaRecorderOnDataAvailable (e) {
      chunks.push(e.data);
    }

    function mediaRecorderOnStop (e) {
        console.log('mediaRecorder on stop')
        outputVideo.controls = true
        var blob = new Blob(chunks, { type: 'video/webm' })
        chunks = []
        outputVideoURL = URL.createObjectURL(blob)
        recordVideo.src = outputVideoURL;
        //outputVideo.append(recordVideo);
        
        //saveData(outputVideoURL);

        
    }
}

function saveData () {
    var fileName = 'my-download-' + Date.now() + '.webm';
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = outputVideoURL;
    a.download = fileName;
    a.click();
  }




const muteUnmute = () => {
    const enabled = myAudioStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myAudioStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }
    else {
        myAudioStream.getAudioTracks()[0].enabled = true;
        setMuteButton();
    }
}

const setMuteButton = () => {
    const html = `
        <i class="fas fa-microphone"></i>
        <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
        <i class="unmute fas fa-microphone-slash"></i>
        <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}

const playStop = () => {
    const enabled = myScreenStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myScreenStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    }
    else {
        myScreenStream.getVideoTracks()[0].enabled = true;
        setStopVideo();
    }
}

const setStopVideo = () => {
    const html = `
        <i class="fas fa-video"></i>
        <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `
        <i class="stop fas fa-video-slash"></i>
        <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
}