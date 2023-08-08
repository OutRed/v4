function UnityProgress (gameInstance, progress) {
	
	var message;
	
	if (progress == 1) {
		message = "Preparing...";
		document.getElementById("bgBar").style.display = "none";
		document.getElementById("progressBar").style.display = "none";
	} else {
		message = "Loading " + Math.floor(Math.min(progress * 100, 100)).toString() + "%";
	}
	
	var length = 200 * Math.min(progress, 1);
	bar = document.getElementById("progressBar")
	bar.style.width = length + "px";
	document.getElementById("loadingInfo").innerHTML = message;
}