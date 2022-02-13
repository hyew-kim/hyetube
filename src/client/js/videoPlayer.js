const container = document.querySelector("#container");
const video = document.querySelector("video");
const playBtn = document.querySelector(".play");
const muteBtn = document.querySelector(".mute");
const fullscreenBtn = document.querySelector(".fullscreen");
const volumeController = document.querySelector(".volume");
const timeStamp = document.querySelector(".time");
const current = timeStamp.querySelector(".currentTime");
const total = timeStamp.querySelector(".totalTime");
const timeline = document.querySelector(".timeline");

let volume = 0.5;
let videoTimerId = "";
let timelineTimerId = "";

const handlePlayIcon = function () {
  playBtn.querySelector("i").className = video.paused
    ? "fas fa-play"
    : "fas fa-pause";
};

const handlePlay = function () {
  if (video.paused) video.play();
  else video.pause();
};
const setVolme = function (value) {
  video.volume = value;
  volume = value;
};

setVolme(volume);

const handleMuteBtn = function () {
  video.muted = !video.muted;
  muteBtn.querySelector("i").className = video.muted
    ? "fa-solid fa-volume-xmark"
    : "fa-solid fa-volume-high";
  if (video.muted) volume = video.volume;
  volumeController.value = video.muted ? 0 : volume;
};

const handleVolume = function (evt) {
  const { value } = evt.target;
  if (video.muted || value === "0") muteBtn.click();
  setVolme(value);
};

const handleFullscreenBtn = function () {
  const fullscreen = document.fullscreenElement;
  if (!fullscreen) container.requestFullscreen();
  else document.exitFullscreen();
};
const handleFullscreenIcon = function () {
  const fullscreen = document.fullscreenElement;
  fullscreenBtn.querySelector("i").className = fullscreen
    ? "fas fa-compress"
    : "fas fa-expand";
  fullscreenBtn.setAttribute("title", "전체화면 종료 esc");
};

const handleKeydown = function (evt) {
  const { key, target } = evt;
  const fullscreen = document.fullscreenElement;
  if (target.localName !== "textarea") {
    if ((key === "Escape" || key === "Esc") && fullscreen)
      handleFullscreenBtn();
    if (key === "f" && !fullscreen) handleFullscreenBtn();
    if (key === " ") handlePlay();
  }
};
const formatTime = (time) =>
  new Date(time * 1000).toISOString().substring(11, 19);
const handleLoadedMetadata = function () {
  const duration = Math.floor(video.duration);
  total.innerText = formatTime(duration);
  current.innerText = formatTime(0);
  timeline.max = duration;
};

const handleTimeUpdate = function () {
  const time = Math.floor(video.currentTime);
  current.innerText = formatTime(time);
  timeline.value = time;
  if (video.currentTime === video.duration)
    playBtn.querySelector("i").className = "fa-solid fa-rotate-right";
};

const handleTimeline = function (evt) {
  const { value } = evt.target;
  video.pause();
  clearTimeout(timelineTimerId);
  timelineTimerId = setTimeout(function () {
    video.play();
  }, 1000 * 1);
  video.currentTime = value;
};
const handleMousemove = function () {
  clearTimeout(videoTimerId);
  video.classList.add("on");
  timerId = setTimeout(function () {
    video.classList.remove("on");
  }, 1000 * 4);
};

playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMuteBtn);
volumeController.addEventListener("input", handleVolume);
fullscreenBtn.addEventListener("click", handleFullscreenBtn);
document.addEventListener("keydown", handleKeydown);
document.addEventListener("fullscreenchange", handleFullscreenIcon);
timeline.addEventListener("input", handleTimeline);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("play", handlePlayIcon);
video.addEventListener("pause", handlePlayIcon);
video.addEventListener("click", handlePlay);
container.addEventListener("mousemove", handleMousemove);
