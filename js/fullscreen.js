function fullscreenFunction() {
  const iframe = document.getElementById("game-frame");

  if (iframe.requestFullscreen) {
    iframe.requestFullscreen();
  } else if (iframe.mozRequestFullScreen) {
    // Firefox
    iframe.mozRequestFullScreen();
  } else if (iframe.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    iframe.webkitRequestFullscreen();
  } else if (iframe.msRequestFullscreen) {
    // IE/Edge
    iframe.msRequestFullscreen();
  }
}

// Make the fullscreen button use the fullscreen function when clicked
const fullscreenButton = document.querySelector(".fullscreen-svg");
fullscreenButton.addEventListener("click", fullscreenFunction);

function shareFunction() {}
