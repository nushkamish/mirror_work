// --- CONFIG ---
// Adjust paths/filenames as needed:
const MIDDLE_VIDEO = "imgs/V1_(Middle).mp4";
const FINAL_VIDEO  = "imgs/V7_Final.mp4";

const SIDE_VIDEOS = [
  "imgs/V2.mp4",
  "imgs/V3.mp4",
  "imgs/V4.mp4",
  "imgs/V5.mp4",
  "imgs/V6.mp4"
];

// 10% chance to trigger V7-only mode
const FINAL_CHANCE = 0.1;

document.addEventListener("DOMContentLoaded", () => {
  const introScreen   = document.getElementById("intro-screen");
  const tripleScreen  = document.getElementById("triple-screen");
  const introVideo    = document.getElementById("intro-video");
  const fadeOverlay   = document.getElementById("fade-overlay");

  const leftVid   = document.getElementById("video-left");
  const middleVid = document.getElementById("video-middle");
  const rightVid  = document.getElementById("video-right");

  // Helper: set up sources + play
  function setupTripleVideos() {
    const roll = Math.random();

    if (roll < FINAL_CHANCE) {
      // Rare: all three are V7_Final
      leftVid.src   = FINAL_VIDEO;
      middleVid.src = FINAL_VIDEO;
      rightVid.src  = FINAL_VIDEO;

      // All full volume in takeover mode
      leftVid.volume   = 1;
      middleVid.volume = 1;
      rightVid.volume  = 1;
    } else {
      // Normal: middle fixed, sides random from V2–V6
      middleVid.src = MIDDLE_VIDEO;

      const shuffled = [...SIDE_VIDEOS].sort(() => Math.random() - 0.5);
      leftVid.src  = shuffled[0];
      rightVid.src = shuffled[1];

      // Volume levels
      leftVid.volume   = 1;
      rightVid.volume  = 1;
      middleVid.volume = 0.8; // 👈 V1 at 80%
    }

    // Load + play
    [leftVid, middleVid, rightVid].forEach(video => {
      video.load();
      video.play().catch(() => {});
    });
  }

  // Generic fade helper: fade to black, run callback, then fade out
  function fadeTransition(callback, duration = 250) {
    fadeOverlay.style.opacity = 1;
    setTimeout(() => {
      callback();
      // tiny delay so changes happen "under" the black
      setTimeout(() => {
        fadeOverlay.style.opacity = 0;
      }, 50);
    }, duration);
  }

  // 1) Intro → Triple screen
  function enterTripleScreen() {
    fadeTransition(() => {
      if (introVideo) introVideo.pause();
      introScreen.classList.add("hidden");
      tripleScreen.classList.remove("hidden");

      setupTripleVideos();
    });

    introScreen.removeEventListener("click", enterTripleScreen);
  }

  // 2) Refresh triple videos (no intro)
  function refreshTripleVideos() {
    fadeTransition(() => {
      setupTripleVideos();
    });
  }

  // Click intro to go in
  introScreen.addEventListener("click", enterTripleScreen);

  // Only refresh when clicking on the videos themselves
  [leftVid, middleVid, rightVid].forEach(video => {
    video.addEventListener("click", (e) => {
      e.stopPropagation();
      refreshTripleVideos();
    });
  });
});
