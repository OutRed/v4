/*function showSharePopup() {
    var gameUrl = document.getElementById("game-frame").src;
    var encodedGameUrl = encodeURIComponent(gameUrl);
    var shareUrl = "https://outred.org/g/load.html?src=" + encodedGameUrl;

    var popup = document.createElement("div");
    popup.className = "share-popup";

    var text = document.createElement("div");
    text.className = "popup-text";
    text.textContent = "Share";

    var encodedUrl = document.createElement("div");
    encodedUrl.className = "encoded-url";
    encodedUrl.textContent = shareUrl;

    var copyButton = document.createElement("button");
    copyButton.className = "copy-button";
    copyButton.textContent = "Copy";
    copyButton.addEventListener("click", function() {
        copyToClipboard(shareUrl);
        alert("Link copied to clipboard!");
    });

    var closeButton = document.createElement("span");
    closeButton.className = "close-button";
    closeButton.textContent = "X";
    closeButton.addEventListener("click", function() {
        document.body.removeChild(popup);
    });

    popup.appendChild(text);
    popup.appendChild(encodedUrl);
    popup.appendChild(copyButton);
    popup.appendChild(closeButton);

    document.body.appendChild(popup);
} */
function showSharePopup() {
  var gameUrl = document.getElementById("game-frame").src;
  var encodedGameUrl = encodeURIComponent(gameUrl);
  var shareUrl = "https://outred.org/g/load.html?src=" + encodedGameUrl;

  var popup = document.createElement("div");
  popup.className = "share-popup";

  var text = document.createElement("div");
  text.className = "popup-text";
  text.textContent = "Share";

  var encodedUrl = document.createElement("div");
  encodedUrl.className = "encoded-url";
  encodedUrl.textContent = shareUrl;

  var copyButton = document.createElement("button");
  copyButton.className = "copy-button";
  copyButton.textContent = "Copy";
  copyButton.addEventListener("click", function () {
    copyToClipboard(shareUrl);
    alert("Link copied to clipboard!");
  });

  var closeButton = document.createElement("span");
  closeButton.className = "close-button";
  closeButton.textContent = "X";
  closeButton.addEventListener("click", function () {
    document.body.removeChild(popup);
  });

  popup.appendChild(text);
  popup.appendChild(encodedUrl);
  popup.appendChild(copyButton);
  popup.appendChild(closeButton);

  document.body.appendChild(popup);
}

function copyToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = 0;
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";
  document.body.appendChild(textArea);
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Copying text command was " + msg);
  } catch (err) {
    console.log("Oops, unable to copy!");
  }

  document.body.removeChild(textArea);
}
