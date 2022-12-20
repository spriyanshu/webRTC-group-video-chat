const socket = io("/");
myVideo = document.createElement("video");
videoGrid = document.getElementById("video-grid");
myVideo.muted = true;
const peers = {};
var peer = new Peer({ path: "/myapp", host: "/", port: "3000" });
let localeStream;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    localeStream = stream;
    addVideoStream(myVideo, localeStream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectNewUser(userId, stream);
    });
    socket.on("user-disconnected", (userId) => {
      if (peers[userId]) peers[userId].close();
    });
  });

peer.on("open", (id) => {
  socket.emit("join-room", roomId, id);
});

const connectNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });
  peers[userId] = call;
};
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

let isAudio = true;
function muteAudio() {
  isAudio = !isAudio;
  localeStream.getAudioTracks()[0].enabled = isAudio;
}

let isVideo = true;
function muteVideo() {
  isVideo = !isVideo;
  localeStream.getVideoTracks()[0].enabled = isVideo;
}
//
const texts = [];
const recognition = new (window.SpeechRecognition ||
  //@ts-ignore
  window.webkitSpeechRecognition)();
recognition.maxAlternatives = 1;
recognition.lang = "en-US";
recognition.continuous = true;

recognition.start();

recognition.onresult = (e) => {
  const current = e.resultIndex;
  const transcript = e.results[current][0].transcript;
  texts.push(transcript);
  socket.emit("text", texts.join("<br />"));
  document.getElementById("text").innerHTML = texts.join("<br />");
};
socket.on("text", (text) => {
  document.getElementById("text").innerHTML = text;
});
