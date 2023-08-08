function captureReady(){
	parent.postMessage('captureReady', '*');
}

var lastSnapthoughtOrigin;
var lastSnapthoughtSource;

function receiver(event) {
	if(event.origin.indexOf(".icivics.org", event.origin.length - 12) !== -1){
		if (event.data == 'captureImage') {
			lastSnapthoughtOrigin = event.origin;
			lastSnapthoughtSource = event.source;
			/*
			BrainPop's SnapThought overlay steals focus from the 
			Unity canvas which prevents SendMessage from getting through
			to the game. We can't enable RunInBackground because of 
			peformance concerns on some devices. As a hack, we simply set
			the focus back to the canvas.
			*/
			var canvas = document.getElementById('#canvas');
			canvas.setAttribute("tabIndex", 0);
			canvas.focus();
			SendMessage('BrainpopConnector', 'CaptureImage');
		};
	}
}

function sendImage(imageString){
	imageString=imageString.replace("data:image/jpeg;base64,","");
	if(window.console.log) {
		var startImageString=imageString.substr(0,20);
		window.console.log("sendImage");
		window.console.log(startImageString);
    } 
	//capture.js already appends this, so we end up with two
	lastSnapthoughtSource.postMessage(imageString, lastSnapthoughtOrigin);//send it back
}

if (window.addEventListener){
	window.addEventListener('message', receiver, false);
} else if (window.attachEvent){
	window.attachEvent('onmessage', receiver);
}
