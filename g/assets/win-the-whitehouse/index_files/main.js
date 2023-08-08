$(document).ready(function () {
  $(window).keydown(function (e) {
      if (e.target === document.body && (e.keyCode == 9 || e.keyCode == 8)) {
          // 9 is tab, 8 is backspace
          e.preventDefault();
      }
  });
});

function SendMessage(target, message, argument) {
  window.gameInstance.SendMessage(target, message, argument);
}

function getGameConfig() {
  if (window && window.parent && window.parent.icivics) {
      SendMessage("GameManager", "SetGameConfig", JSON.stringify(window.parent.icivics.getGameConfig()));
  }
}