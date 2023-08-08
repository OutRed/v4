var canvasScaler = function(width, height, elementID) {
	
	var self = this;
	
	this.idealWidth = width;
	this.idealHeight = height;
	this.aspectRatio = width / height;
	this.targetID = elementID;
	
	this.windowWidth = this.idealWidth;
	this.windowHeight = this.idealHeight;
	
	this.visible = false;
	
	document.addEventListener('DOMContentLoaded', function() {
		self.hideElement();
	});
	
	window.addEventListener('resize', function() {
		if (self.visible) {
			setTimeout(self.updateCanvasSize, 0);
		}
	});
	
	this.updateCanvasSize = function() {
		var targetElement = document.getElementById(self.targetID);
		
		self.windowWidth = targetElement.parentElement.clientWidth;
		self.windowHeight = targetElement.parentElement.clientHeight;
		
		// If width is more compressed than height
		if ((self.windowWidth / self.idealWidth) < (self.windowHeight / self.idealHeight)) {
			self.windowHeight = self.windowWidth / self.aspectRatio;//Math.min(self.windowWidth / self.aspectRatio, self.idealHeight);
			self.windowWidth = self.windowHeight * self.aspectRatio;//Math.min(self.windowHeight * self.aspectRatio, self.idealWidth);
		} else {
			self.windowWidth = self.windowHeight * self.aspectRatio;//Math.min(self.windowHeight * self.aspectRatio, self.idealWidth);
			self.windowHeight = self.windowWidth / self.aspectRatio;//Math.min(self.windowWidth / self.aspectRatio, self.idealHeight);
		}
		
		var sizeStyle = "width: " + self.windowWidth + "px; height: " + self.windowHeight + "px; margin: auto;"
		targetElement.setAttribute("style", sizeStyle);
		
		var canvasElement = document.getElementById("#canvas");
		if (canvasElement != null) {
			canvasElement.setAttribute("style", sizeStyle);
			canvasElement.setAttribute("height", self.windowHeight);
			canvasElement.setAttribute("width", self.windowWidth);
		}
	}
	
	this.hideElement = function() {
		self.visible = false;
		document.getElementById(self.targetID).style.visibility = 'hidden';
	}
	
	this.showElement = function() {
		self.visible = true;
		document.getElementById(self.targetID).style.visibility = 'visible';
		self.updateCanvasSize();
	}
	
}