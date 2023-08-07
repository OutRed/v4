var Utils;
(function (Utils) {
    var AssetLoader = (function () {
        function AssetLoader(_lang, _aFileData, _ctx, _canvasWidth, _canvasHeight, _showBar) {
            if (typeof _showBar === "undefined") { _showBar = true; }
            this.oAssetData = {
            };
            this.assetsLoaded = 0;
            this.textData = {
            };
            this.spinnerRot = 0;
            this.totalAssets = _aFileData.length;
            this.showBar = _showBar;
            for(var i = 0; i < _aFileData.length; i++) {
                if(_aFileData[i].file.indexOf(".json") != -1) {
                    this.loadJSON(_aFileData[i]);
                } else {
                    this.loadImage(_aFileData[i]);
                }
            }
            if(_showBar) {
                this.oLoaderImgData = preAssetLib.getData("loader");
                this.oLoadSpinnerImgData = preAssetLib.getData("loadSpinner");
            }
        }
        AssetLoader.prototype.render = function () {
            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 + 70, (300 / this.totalAssets) * this.assetsLoaded, 30);
            ctx.drawImage(this.oLoaderImgData.img, canvas.width / 2 - this.oLoaderImgData.img.width / 2, canvas.height / 2 - this.oLoaderImgData.img.height / 2);
            this.spinnerRot += delta * 3;
            ctx.save();
            ctx.translate(canvas.width / 2 - 38, canvas.height / 2 + 36);
            ctx.scale(.7 + Math.sin(this.spinnerRot * 2) / 10, .7 + Math.sin(this.spinnerRot * 2) / 10);
            ctx.rotate(this.spinnerRot);
            ctx.drawImage(this.oLoadSpinnerImgData.img, -this.oLoadSpinnerImgData.img.width / 2, -this.oLoadSpinnerImgData.img.height / 2);
            ctx.restore();
            this.displayNumbers();
        };
        AssetLoader.prototype.displayNumbers = function () {
            ctx.textAlign = "left";
            ctx.font = "bold 40px arial";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(Math.round((this.assetsLoaded / this.totalAssets) * 100) + "%", canvas.width / 2 - 10, canvas.height / 2 + 50);
        };
        AssetLoader.prototype.loadExtraAssets = function (_callback, _aFileData) {
            this.showBar = false;
            this.totalAssets = _aFileData.length;
            this.assetsLoaded = 0;
            this.loadedCallback = _callback;
            for(var i = 0; i < _aFileData.length; i++) {
                if(_aFileData[i].file.indexOf(".json") != -1) {
                    this.loadJSON(_aFileData[i]);
                } else {
                    this.loadImage(_aFileData[i]);
                }
            }
        };
        AssetLoader.prototype.loadJSON = function (_oData) {
            var _this = this;
            var xobj = new XMLHttpRequest();
            xobj.open('GET', _oData.file, true);
            xobj.onreadystatechange = function () {
                if(xobj.readyState == 4 && xobj.status == 200) {
                    _this.textData[_oData.id] = JSON.parse(xobj.responseText);
                    ++_this.assetsLoaded;
                    _this.checkLoadComplete();
                }
            };
            xobj.send(null);
        };
        AssetLoader.prototype.loadImage = function (_oData) {
            var _this = this;
            var img = new Image();
            img.onload = function () {
                _this.oAssetData[_oData.id] = {
                };
                _this.oAssetData[_oData.id].img = img;
                _this.oAssetData[_oData.id].oData = {
                };
                var aSpriteSize = _this.getSpriteSize(_oData.file);
                if(aSpriteSize[0] != 0) {
                    _this.oAssetData[_oData.id].oData.spriteWidth = aSpriteSize[0];
                    _this.oAssetData[_oData.id].oData.spriteHeight = aSpriteSize[1];
                } else {
                    _this.oAssetData[_oData.id].oData.spriteWidth = _this.oAssetData[_oData.id].img.width;
                    _this.oAssetData[_oData.id].oData.spriteHeight = _this.oAssetData[_oData.id].img.height;
                }
                if(_oData.oAnims) {
                    _this.oAssetData[_oData.id].oData.oAnims = _oData.oAnims;
                }
                if(_oData.oAtlasData) {
                    _this.oAssetData[_oData.id].oData.oAtlasData = _oData.oAtlasData;
                } else {
                    _this.oAssetData[_oData.id].oData.oAtlasData = {
                        none: {
                            x: 0,
                            y: 0,
                            width: _this.oAssetData[_oData.id].oData.spriteWidth,
                            height: _this.oAssetData[_oData.id].oData.spriteHeight
                        }
                    };
                }
                ++_this.assetsLoaded;
                _this.checkLoadComplete();
            };
            img.src = _oData.file;
        };
        AssetLoader.prototype.getSpriteSize = function (_file) {
            var aNew = new Array();
            var sizeY = "";
            var sizeX = "";
            var stage = 0;
            var inc = _file.lastIndexOf(".");
            var canCont = true;
            while(canCont) {
                inc--;
                if(stage == 0 && this.isNumber(_file.charAt(inc))) {
                    sizeY = _file.charAt(inc) + sizeY;
                } else if(stage == 0 && sizeY.length > 0 && _file.charAt(inc) == "x") {
                    inc--;
                    stage = 1;
                    sizeX = _file.charAt(inc) + sizeX;
                } else if(stage == 1 && this.isNumber(_file.charAt(inc))) {
                    sizeX = _file.charAt(inc) + sizeX;
                } else if(stage == 1 && sizeX.length > 0 && _file.charAt(inc) == "_") {
                    canCont = false;
                    aNew = [
                        parseInt(sizeX), 
                        parseInt(sizeY)
                    ];
                } else {
                    canCont = false;
                    aNew = [
                        0, 
                        0
                    ];
                }
            }
            return aNew;
        };
        AssetLoader.prototype.isNumber = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };
        AssetLoader.prototype.checkLoadComplete = function () {
            if(this.assetsLoaded == this.totalAssets) {
                this.loadedCallback();
            }
        };
        AssetLoader.prototype.onReady = function (_func) {
            this.loadedCallback = _func;
        };
        AssetLoader.prototype.getImg = function (_id) {
            return this.oAssetData[_id].img;
        };
        AssetLoader.prototype.getData = function (_id) {
            return this.oAssetData[_id];
        };
        return AssetLoader;
    })();
    Utils.AssetLoader = AssetLoader;    
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var AnimSprite = (function () {
        function AnimSprite(_oImgData, _fps, _radius, _animId) {
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.radius = 10;
            this.removeMe = false;
            this.frameInc = 0;
            this.animType = "loop";
            this.offsetX = 0;
            this.offsetY = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.alpha = 1;
            this.oImgData = _oImgData;
            this.oAnims = this.oImgData.oData.oAnims;
            this.fps = _fps;
            this.radius = _radius;
            this.animId = _animId;
            this.centreX = Math.round(this.oImgData.oData.spriteWidth / 2);
            this.centreY = Math.round(this.oImgData.oData.spriteHeight / 2);
        }
        AnimSprite.prototype.updateAnimation = function (_delta) {
            this.frameInc += this.fps * _delta;
        };
        AnimSprite.prototype.changeImgData = function (_newImgData, _animId) {
            this.oImgData = _newImgData;
            this.oAnims = this.oImgData.oData.oAnims;
            this.animId = _animId;
            this.centreX = Math.round(this.oImgData.oData.spriteWidth / 2);
            this.centreY = Math.round(this.oImgData.oData.spriteHeight / 2);
            this.resetAnim();
        };
        AnimSprite.prototype.resetAnim = function () {
            this.frameInc = 0;
        };
        AnimSprite.prototype.setFrame = function (_frameNum) {
            this.fixedFrame = _frameNum;
        };
        AnimSprite.prototype.setAnimType = function (_type, _animId, _reset) {
            if (typeof _reset === "undefined") { _reset = true; }
            this.animId = _animId;
            this.animType = _type;
            if(_reset) {
                this.resetAnim();
            }
            switch(_type) {
                case "loop":
                    break;
                case "once":
                    this.maxIdx = this.oAnims[this.animId].length - 1;
                    break;
            }
        };
        AnimSprite.prototype.render = function (_ctx) {
            _ctx.save();
            _ctx.translate(this.x, this.y);
            _ctx.rotate(this.rotation);
            _ctx.scale(this.scaleX, this.scaleY);
            _ctx.globalAlpha = this.alpha;
            if(this.animId != null) {
                var max = this.oAnims[this.animId].length;
                var idx = Math.floor(this.frameInc);
                this.curFrame = this.oAnims[this.animId][idx % max];
                var imgX = (this.curFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(this.curFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                if(this.animType == "once") {
                    if(idx > this.maxIdx) {
                        this.fixedFrame = this.oAnims[this.animId][max - 1];
                        this.animId = null;
                        if(this.animEndedFunc != null) {
                            this.animEndedFunc();
                        }
                        var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                        var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                    }
                }
            } else {
                var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            }
            _ctx.drawImage(this.oImgData.img, imgX, imgY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.centreX + this.offsetX, -this.centreY + this.offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight);
            _ctx.restore();
        };
        AnimSprite.prototype.renderSimple = function (_ctx) {
            if(this.animId != null) {
                var max = this.oAnims[this.animId].length;
                var idx = Math.floor(this.frameInc);
                this.curFrame = this.oAnims[this.animId][idx % max];
                var imgX = (this.curFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(this.curFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                if(this.animType == "once") {
                    if(idx > this.maxIdx) {
                        this.fixedFrame = this.oAnims[this.animId][max - 1];
                        this.animId = null;
                        if(this.animEndedFunc != null) {
                            this.animEndedFunc();
                        }
                        var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                        var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                    }
                }
            } else {
                var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            }
            _ctx.drawImage(this.oImgData.img, imgX, imgY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, this.x - (this.centreX - this.offsetX) * this.scaleX, this.y - (this.centreY - this.offsetY) * this.scaleY, this.oImgData.oData.spriteWidth * this.scaleX, this.oImgData.oData.spriteHeight * this.scaleY);
        };
        return AnimSprite;
    })();
    Utils.AnimSprite = AnimSprite;    
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var BasicSprite = (function () {
        function BasicSprite(_oImgData, _radius, _frame) {
            if (typeof _frame === "undefined") { _frame = 0; }
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.radius = 10;
            this.removeMe = false;
            this.offsetX = 0;
            this.offsetY = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.oImgData = _oImgData;
            this.radius = _radius;
            this.setFrame(_frame);
        }
        BasicSprite.prototype.setFrame = function (_frameNum) {
            this.frameNum = _frameNum;
        };
        BasicSprite.prototype.render = function (_ctx) {
            _ctx.save();
            _ctx.translate(this.x, this.y);
            _ctx.rotate(this.rotation);
            _ctx.scale(this.scaleX, this.scaleY);
            var imgX = (this.frameNum * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
            var imgY = Math.floor(this.frameNum / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            _ctx.drawImage(this.oImgData.img, imgX, imgY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.oImgData.oData.spriteWidth / 2 + this.offsetX, -this.oImgData.oData.spriteHeight / 2 + this.offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight);
            _ctx.restore();
        };
        return BasicSprite;
    })();
    Utils.BasicSprite = BasicSprite;    
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var UserInput = (function () {
        function UserInput(_canvas, _isBugBrowser) {
            var _this = this;
            this.prevHitTime = 0;
            this.pauseIsOn = false;
            this.isDown = false;
            this.isBugBrowser = _isBugBrowser;
            this.keyDownEvtFunc = function (e) {
                _this.keyDown(e);
            };
            this.keyUpEvtFunc = function (e) {
                _this.keyUp(e);
            };
            _canvas.addEventListener('contextmenu', function (event) {
                return event.preventDefault();
            });
            _canvas.addEventListener("touchstart", function (e) {
                for(var i = 0; i < e.changedTouches.length; i++) {
                    _this.hitDown(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
                }
            }, false);
            _canvas.addEventListener("touchend", function (e) {
                for(var i = 0; i < e.changedTouches.length; i++) {
                    _this.hitUp(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
                }
            }, false);
            _canvas.addEventListener("touchcancel", function (e) {
                for(var i = 0; i < e.changedTouches.length; i++) {
                    _this.hitCancel(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
                }
            }, false);
            _canvas.addEventListener("touchmove", function (e) {
                for(var i = 0; i < e.changedTouches.length; i++) {
                    _this.move(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier, true);
                }
            }, false);
            _canvas.addEventListener("mousedown", function (e) {
                _this.isDown = true;
                _this.hitDown(e, e.pageX, e.pageY, 1);
            }, false);
            _canvas.addEventListener("mouseup", function (e) {
                _this.isDown = false;
                _this.hitUp(e, e.pageX, e.pageY, 1);
            }, false);
            _canvas.addEventListener("mousemove", function (e) {
                _this.move(e, e.pageX, e.pageY, 1, _this.isDown);
            }, false);
            _canvas.addEventListener("mouseout", function (e) {
                if(e.button == 2) {
                    return;
                }
                clearButtonOvers();
                _this.isDown = false;
                _this.hitUp(e, Math.abs(e.pageX), Math.abs(e.pageY), 1);
            }, false);
            this.aHitAreas = new Array();
            this.aKeys = new Array();
        }
        UserInput.prototype.hitDown = function (e, _posX, _posY, _identifer) {
            e.preventDefault();
            e.stopPropagation();
            if(!hasFocus) {
                visibleResume();
            }
            if(this.pauseIsOn) {
                return;
            }
            var curHitTime = new Date().getTime();
            _posX *= canvasScale;
            _posY *= canvasScale;
            for(var i = 0; i < this.aHitAreas.length; i++) {
                if(this.aHitAreas[i].rect) {
                    var aX = canvas.width * this.aHitAreas[i].align[0];
                    var aY = canvas.height * this.aHitAreas[i].align[1];
                    if(_posX > aX + this.aHitAreas[i].area[0] && _posY > aY + this.aHitAreas[i].area[1] && _posX < aX + this.aHitAreas[i].area[2] && _posY < aY + this.aHitAreas[i].area[3]) {
                        this.aHitAreas[i].aTouchIdentifiers.push(_identifer);
                        this.aHitAreas[i].oData.hasLeft = false;
                        if(!this.aHitAreas[i].oData.isDown) {
                            this.aHitAreas[i].oData.isDown = true;
                            this.aHitAreas[i].oData.x = _posX;
                            this.aHitAreas[i].oData.y = _posY;
                            if((curHitTime - this.prevHitTime < 500 && (gameState != "game" || this.aHitAreas[i].id == "pause")) && isBugBrowser) {
                                return;
                            }
                            this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                        }
                        break;
                    }
                } else {
                }
            }
            this.prevHitTime = curHitTime;
        };
        UserInput.prototype.hitUp = function (e, _posX, _posY, _identifer) {
            if(!ios9FirstTouch) {
                playSound("silence");
                ios9FirstTouch = true;
            }
            if(this.pauseIsOn) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            _posX *= canvasScale;
            _posY *= canvasScale;
            for(var i = 0; i < this.aHitAreas.length; i++) {
                if(this.aHitAreas[i].rect) {
                    var aX = canvas.width * this.aHitAreas[i].align[0];
                    var aY = canvas.height * this.aHitAreas[i].align[1];
                    if(_posX > aX + this.aHitAreas[i].area[0] && _posY > aY + this.aHitAreas[i].area[1] && _posX < aX + this.aHitAreas[i].area[2] && _posY < aY + this.aHitAreas[i].area[3]) {
                        for(var j = 0; j < this.aHitAreas[i].aTouchIdentifiers.length; j++) {
                            if(this.aHitAreas[i].aTouchIdentifiers[j] == _identifer) {
                                this.aHitAreas[i].aTouchIdentifiers.splice(j, 1);
                                j -= 1;
                            }
                        }
                        if(this.aHitAreas[i].aTouchIdentifiers.length == 0) {
                            this.aHitAreas[i].oData.isDown = false;
                            if(this.aHitAreas[i].oData.multiTouch) {
                                this.aHitAreas[i].oData.x = _posX;
                                this.aHitAreas[i].oData.y = _posY;
                                this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                            }
                        }
                        break;
                    }
                } else {
                }
            }
        };
        UserInput.prototype.hitCancel = function (e, _posX, _posY, _identifer) {
            e.preventDefault();
            e.stopPropagation();
            _posX *= canvasScale;
            _posY *= canvasScale;
            for(var i = 0; i < this.aHitAreas.length; i++) {
                if(this.aHitAreas[i].oData.isDown) {
                    this.aHitAreas[i].oData.isDown = false;
                    this.aHitAreas[i].aTouchIdentifiers = new Array();
                    if(this.aHitAreas[i].oData.multiTouch) {
                        this.aHitAreas[i].oData.x = _posX;
                        this.aHitAreas[i].oData.y = _posY;
                        this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                    }
                }
            }
        };
        UserInput.prototype.move = function (e, _posX, _posY, _identifer, _isDown) {
            if(!isMobile && userBat != undefined && !firstRun) {
                userBat.targX = _posX * canvasScale;
                userBat.targY = _posY * canvasScale;
            }
            _posX *= canvasScale;
            _posY *= canvasScale;
            this.mouseX = _posX;
            this.mouseY = _posY;
            if(this.pauseIsOn) {
                return;
            }
            if(_isDown) {
                for(var i = 0; i < this.aHitAreas.length; i++) {
                    if(this.aHitAreas[i].rect) {
                        var aX = canvas.width * this.aHitAreas[i].align[0];
                        var aY = canvas.height * this.aHitAreas[i].align[1];
                        if(_posX > aX + this.aHitAreas[i].area[0] && _posY > aY + this.aHitAreas[i].area[1] && _posX < aX + this.aHitAreas[i].area[2] && _posY < aY + this.aHitAreas[i].area[3]) {
                            this.aHitAreas[i].oData.hasLeft = false;
                            if(this.aHitAreas[i].oData.isDraggable && !this.aHitAreas[i].oData.isDown) {
                                this.aHitAreas[i].oData.isDown = true;
                                this.aHitAreas[i].oData.x = _posX;
                                this.aHitAreas[i].oData.y = _posY;
                                this.aHitAreas[i].aTouchIdentifiers.push(_identifer);
                                if(this.aHitAreas[i].oData.multiTouch) {
                                    this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                                }
                            }
                            if(this.aHitAreas[i].oData.isDraggable) {
                                this.aHitAreas[i].oData.isBeingDragged = true;
                                this.aHitAreas[i].oData.x = _posX;
                                this.aHitAreas[i].oData.y = _posY;
                                this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                                if(this.aHitAreas[i]) {
                                    this.aHitAreas[i].oData.isBeingDragged = false;
                                }
                            }
                        } else if(this.aHitAreas[i].oData.isDown && !this.aHitAreas[i].oData.hasLeft) {
                            for(var j = 0; j < this.aHitAreas[i].aTouchIdentifiers.length; j++) {
                                if(this.aHitAreas[i].aTouchIdentifiers[j] == _identifer) {
                                    this.aHitAreas[i].aTouchIdentifiers.splice(j, 1);
                                    j -= 1;
                                }
                            }
                            if(this.aHitAreas[i].aTouchIdentifiers.length == 0) {
                                this.aHitAreas[i].oData.hasLeft = true;
                                if(!this.aHitAreas[i].oData.isBeingDragged) {
                                    this.aHitAreas[i].oData.isDown = false;
                                }
                                if(this.aHitAreas[i].oData.multiTouch) {
                                    this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                                }
                            }
                        }
                    }
                }
            }
        };
        UserInput.prototype.keyDown = function (e) {
            for(var i = 0; i < this.aKeys.length; i++) {
                if(e.keyCode == this.aKeys[i].keyCode) {
                    e.preventDefault();
                    this.aKeys[i].oData.isDown = true;
                    this.aKeys[i].callback(this.aKeys[i].id, this.aKeys[i].oData);
                }
            }
        };
        UserInput.prototype.keyUp = function (e) {
            for(var i = 0; i < this.aKeys.length; i++) {
                if(e.keyCode == this.aKeys[i].keyCode) {
                    e.preventDefault();
                    this.aKeys[i].oData.isDown = false;
                    this.aKeys[i].callback(this.aKeys[i].id, this.aKeys[i].oData);
                }
            }
        };
        UserInput.prototype.checkKeyFocus = function () {
            window.focus();
            if(this.aKeys.length > 0) {
                window.removeEventListener('keydown', this.keyDownEvtFunc, false);
                window.removeEventListener('keyup', this.keyUpEvtFunc, false);
                window.addEventListener('keydown', this.keyDownEvtFunc, false);
                window.addEventListener('keyup', this.keyUpEvtFunc, false);
            }
        };
        UserInput.prototype.addKey = function (_id, _callback, _oCallbackData, _keyCode) {
            if(_oCallbackData == null) {
                _oCallbackData = new Object();
            }
            this.aKeys.push({
                id: _id,
                callback: _callback,
                oData: _oCallbackData,
                keyCode: _keyCode
            });
            this.checkKeyFocus();
        };
        UserInput.prototype.removeKey = function (_id) {
            for(var i = 0; i < this.aKeys.length; i++) {
                if(this.aKeys[i].id == _id) {
                    this.aKeys.splice(i, 1);
                    i -= 1;
                }
            }
        };
        UserInput.prototype.addHitArea = function (_id, _callback, _oCallbackData, _type, _oAreaData, _isUnique) {
            if (typeof _isUnique === "undefined") { _isUnique = false; }
            if(_oCallbackData == null) {
                _oCallbackData = new Object();
            }
            if(_isUnique) {
                this.removeHitArea(_id);
            }
            if(!_oAreaData.scale) {
                _oAreaData.scale = 1;
            }
            if(!_oAreaData.align) {
                _oAreaData.align = [
                    0, 
                    0
                ];
            }
            var aTouchIdentifiers = new Array();
            switch(_type) {
                case "image":
                    var aRect;
                    aRect = new Array(_oAreaData.aPos[0] - (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].width / 2) * _oAreaData.scale, _oAreaData.aPos[1] - (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].height / 2) * _oAreaData.scale, _oAreaData.aPos[0] + (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].width / 2) * _oAreaData.scale, _oAreaData.aPos[1] + (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].height / 2) * _oAreaData.scale);
                    this.aHitAreas.push({
                        id: _id,
                        aTouchIdentifiers: aTouchIdentifiers,
                        callback: _callback,
                        oData: _oCallbackData,
                        rect: true,
                        area: aRect,
                        align: _oAreaData.align
                    });
                    break;
                case "rect":
                    this.aHitAreas.push({
                        id: _id,
                        aTouchIdentifiers: aTouchIdentifiers,
                        callback: _callback,
                        oData: _oCallbackData,
                        rect: true,
                        area: _oAreaData.aRect,
                        align: _oAreaData.align
                    });
                    break;
            }
        };
        UserInput.prototype.removeHitArea = function (_id) {
            for(var i = 0; i < this.aHitAreas.length; i++) {
                if(this.aHitAreas[i].id == _id) {
                    this.aHitAreas.splice(i, 1);
                    i -= 1;
                }
            }
        };
        UserInput.prototype.resetAll = function () {
            for(var i = 0; i < this.aHitAreas.length; i++) {
                this.aHitAreas[i].oData.isDown = false;
                this.aHitAreas[i].oData.isBeingDragged = false;
                this.aHitAreas[i].aTouchIdentifiers = new Array();
            }
            this.isDown = false;
        };
        return UserInput;
    })();
    Utils.UserInput = UserInput;    
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var FpsMeter = (function () {
        function FpsMeter(_canvasHeight) {
            this.updateFreq = 10;
            this.updateInc = 0;
            this.frameAverage = 0;
            this.display = 1;
            this.log = "";
            this.render = function (_ctx) {
                this.frameAverage += this.delta / this.updateFreq;
                if(++this.updateInc >= this.updateFreq) {
                    this.updateInc = 0;
                    this.display = this.frameAverage;
                    this.frameAverage = 0;
                }
                _ctx.textAlign = "left";
                ctx.font = "10px Helvetica";
                _ctx.fillStyle = "#333333";
                _ctx.beginPath();
                _ctx.rect(0, this.canvasHeight - 15, 40, 15);
                _ctx.closePath();
                _ctx.fill();
                _ctx.fillStyle = "#ffffff";
                _ctx.fillText(Math.round(1000 / (this.display * 1000)) + " fps " + this.log, 5, this.canvasHeight - 5);
            };
            this.canvasHeight = _canvasHeight;
        }
        FpsMeter.prototype.update = function (_delta) {
            this.delta = _delta;
        };
        return FpsMeter;
    })();
    Utils.FpsMeter = FpsMeter;    
})(Utils || (Utils = {}));
var Elements;
(function (Elements) {
    var Background = (function () {
        function Background() {
            this.x = 0;
            this.y = 0;
            this.targY = 0;
            this.incY = 0;
            this.renderState = null;
            this.wallId = 0;
            this.bgBatIncX = 100;
            this.bgBatIncY = 0;
            this.bgBatIncSin = 0;
            this.oImgData = assetLib.getData("fadeBg");
            this.oGameThemesImgData = assetLib.getData("gameThemes");
            this.oGameBgsImgData = assetLib.getData("gameBgs");
            this.oUiElementsImgData = assetLib.getData("uiElements");
            this.wallId = alevelThemes[opChar];
            this.resetBgBatSpacing();
        }
        Background.prototype.resetBgBatSpacing = function () {
            this.aBgBats = new Array();
            for(var i = 0; i < 20; i++) {
                this.aBgBats.push({
                    x: (canvas.width / 5) * (i % 5) + (100 / 5) * (i % 5),
                    y: (canvas.height / 4) * Math.floor(i / 5) + (100 / 4) * Math.floor(i / 5)
                });
            }
        };
        Background.prototype.renderGame = function () {
            ctx.drawImage(this.oImgData.img, 0, 0, this.oImgData.img.width, this.oImgData.img.height, 0, 0, canvas.width, canvas.height);
            var bX = this.oGameThemesImgData.oData.oAtlasData[oImageIds["tableBgBottom" + this.wallId]].x;
            var bY = this.oGameThemesImgData.oData.oAtlasData[oImageIds["tableBgBottom" + this.wallId]].y;
            var bWidth = this.oGameThemesImgData.oData.oAtlasData[oImageIds["tableBgBottom" + this.wallId]].width;
            var bHeight = this.oGameThemesImgData.oData.oAtlasData[oImageIds["tableBgBottom" + this.wallId]].height;
            var tempTop = canvas.height / 4 - 210 + 198 + tableTop.offsetY * 25;
            ctx.drawImage(this.oGameThemesImgData.img, bX, bY, bWidth, bHeight, 0, tempTop, canvas.width, (canvas.height - tempTop) * (1 + tableTop.offsetY / 3) * 1.1);
            var bX = this.oGameBgsImgData.oData.oAtlasData[oImageIds["tableBg" + this.wallId]].x;
            var bY = this.oGameBgsImgData.oData.oAtlasData[oImageIds["tableBg" + this.wallId]].y;
            var bWidth = this.oGameBgsImgData.oData.oAtlasData[oImageIds["tableBg" + this.wallId]].width;
            var bHeight = this.oGameBgsImgData.oData.oAtlasData[oImageIds["tableBg" + this.wallId]].height;
            ctx.drawImage(this.oGameBgsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * Math.max(1, canvas.width / bWidth), canvas.height / 4 - 210 + tableTop.offsetY * 25, Math.max(bWidth, canvas.width), bHeight);
        };
        Background.prototype.renderMenu = function () {
            ctx.drawImage(this.oImgData.img, 0, 0, this.oImgData.img.width, this.oImgData.img.height, 0, 0, canvas.width, canvas.height);
            this.bgBatIncSin += 1 * delta;
            this.bgBatIncY = Math.sin(this.bgBatIncSin) * 100;
            for(var i = 0; i < this.aBgBats.length; i++) {
                this.aBgBats[i].x += this.bgBatIncX * delta;
                this.aBgBats[i].y += this.bgBatIncY * delta;
                if(this.aBgBats[i].x > canvas.width + 50) {
                    this.aBgBats[i].x -= canvas.width + 100;
                } else if(this.aBgBats[i].x < -50) {
                    this.aBgBats[i].x += canvas.width + 100;
                }
                if(this.aBgBats[i].y > canvas.height + 50) {
                    this.aBgBats[i].y -= canvas.height + 100;
                } else if(this.aBgBats[i].y < -50) {
                    this.aBgBats[i].y += canvas.height + 100;
                }
                var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.bgBat].x;
                var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.bgBat].y;
                var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.bgBat].width;
                var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.bgBat].height;
                ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, this.aBgBats[i].x - bWidth / 2, this.aBgBats[i].y - bHeight / 2, bWidth, bHeight);
            }
        };
        return Background;
    })();
    Elements.Background = Background;    
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var Panel = (function () {
        function Panel(_panelType, _aButs) {
            this.timer = .3;
            this.endTime = 0;
            this.posY = 0;
            this.fireNumberSpace = 55;
            this.smallNumberSpace = 17;
            this.scoreNumberSpace = 15;
            this.incY = 0;
            this.flareRot = 0;
            this.cupFlipInc = 0;
            this.userCardScale = 1;
            this.enemyCardScale = 1;
            this.userBatX = 0;
            this.userBatY = 0;
            this.enemyBatX = 0;
            this.enemyBatY = 0;
            this.ballX = 0;
            this.ballY = 0;
            this.ballHeight = 0;
            this.flashInc = 0;
            this.promptOffScreen = false;
            this.aZoomCharOffsetx = new Array(0, 0, -75, 0, -10, 0, 0, -10, 0, 0, -55, 0, -35, -15);
            this.progressCharGap = 150;
            this.chatFlip = false;
            this.oSplashLogoImgData = assetLib.getData("splashLogo");
            this.oCountryFlagsImgData = assetLib.getData("countryFlags");
            this.oUiElementsImgData = assetLib.getData("uiElements");
            this.oFireNumbersImgData = assetLib.getData("fireNumbers");
            this.oSmallNumbersImgData = assetLib.getData("smallNumbers");
            this.oScoreNumbersImgData = assetLib.getData("scoreNumbers");
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.panelType = _panelType;
            this.aButs = _aButs;
            this.cupFlipInc = 0;
            this.aTitleCharPos = new Array({
                id: 0,
                side: 0,
                x: 93,
                y: -144
            }, {
                id: 4,
                side: 0,
                x: 71,
                y: -119
            }, {
                id: 1,
                side: 0,
                x: 75,
                y: 60
            }, {
                id: 2,
                side: 0,
                x: 110,
                y: 270
            }, {
                id: 7,
                side: 1,
                x: -117,
                y: -81
            }, {
                id: 5,
                side: 1,
                x: -48,
                y: -34
            }, {
                id: 6,
                side: 1,
                x: -25,
                y: 88
            }, {
                id: 8,
                side: 1,
                x: -71,
                y: 211
            }, {
                id: 3,
                side: 1,
                x: -227,
                y: -172
            });
            if(charLineUp == 0) {
                this.aTitleCharPos[6] = {
                    id: 6,
                    side: 1,
                    x: -25,
                    y: 130
                };
                this.aZoomCharOffsetx[6] = -40;
            }
        }
        Panel.prototype.update = function () {
            this.incY += 10 * delta;
        };
        Panel.prototype.startTween = function () {
            var _this = this;
            switch(gameState) {
                case "start":
                    for(var i = 0; i < this.aTitleCharPos.length; i++) {
                        var tx = this.aTitleCharPos[i].x;
                        var ty = this.aTitleCharPos[i].y;
                        if(this.aTitleCharPos[i].side == 0) {
                            this.aTitleCharPos[i].x = -200;
                        } else {
                            this.aTitleCharPos[i].x = 200;
                        }
                        TweenLite.to(this.aTitleCharPos[i], Math.random() * .8 + .8, {
                            x: tx,
                            ease: "Back.easeOut",
                            delay: Math.random() * .3 + .3
                        });
                    }
                    this.tweenY0 = -300;
                    TweenLite.to(this, .7, {
                        tweenY0: 0,
                        ease: "Cubic.easeOut"
                    });
                    break;
                case "credits":
                    this.tweenY0 = 300;
                    TweenLite.to(this, .7, {
                        tweenY0: 0,
                        ease: "Cubic.easeOut"
                    });
                    break;
                case "charSelect":
                    this.flareScale = 0;
                    this.tweenY0 = -300;
                    TweenLite.to(this, .7, {
                        tweenY0: 0,
                        ease: "Cubic.easeOut"
                    });
                    this.tweenY1 = -(canvas.height / 2 + 200);
                    this.promptTween = TweenLite.to(this, .5, {
                        tweenY1: 0,
                        ease: "Cubic.easeOut"
                    });
                    this.charSelectState = 0;
                    break;
                case "progress":
                    this.tweenY0 = -300;
                    TweenLite.to(this, .7, {
                        tweenY0: 0,
                        ease: "Cubic.easeOut"
                    });
                    this.charScale = 0;
                    this.tweenY1 = 0;
                    this.char0X = 1000;
                    TweenLite.to(this, 1.5, {
                        char0X: 0,
                        ease: "Cubic.easeOut",
                        delay: .3,
                        onComplete: function () {
                            addFirework(canvas.width / 2, canvas.height / 2, 3);
                            playSound("userPoint");
                            playSound("cheer" + Math.floor(Math.random() * 4));
                            if(audioType == 1) {
                                music.fade(music.volume(), .3, 200);
                            }
                            _this.flareScale = 0;
                            TweenLite.to(_this, .5, {
                                flareScale: 1,
                                ease: "Cubic.easeOut"
                            });
                            _this.charScale = .48;
                            TweenLite.to(_this, .5, {
                                charScale: 1,
                                ease: "Back.easeOut"
                            });
                            _this.char1X = -500;
                            TweenLite.to(_this, .5, {
                                char1X: 0,
                                ease: "Cubic.easeOut"
                            });
                            _this.tweenY1 = 0;
                            TweenLite.to(_this, 1.5, {
                                tweenY1: 1,
                                ease: "Elastic.easeOut",
                                onComplete: function () {
                                    initGameIntro();
                                }
                            });
                        }
                    });
                    break;
                case "gameIntro":
                    this.flareScale = 1;
                    this.headerX = -700;
                    TweenLite.to(this, .7, {
                        headerX: 0,
                        ease: "Cubic.easeOut"
                    });
                    this.char1X = 0;
                    TweenLite.to(this, .7, {
                        char1X: 130,
                        ease: "Cubic.easeOut"
                    });
                    this.char0X = -700;
                    TweenLite.to(this, .7, {
                        char0X: -130,
                        ease: "Cubic.easeOut"
                    });
                    this.chatOrder = parseFloat(assetLib.textData.langText[this.getStartChatName() + "A"]["order"]);
                    if(this.chatOrder == 0) {
                        this.chatY0 = 50;
                        TweenLite.to(this, .7, {
                            chatY0: 0,
                            ease: "Elastic.easeOut",
                            delay: .5
                        });
                        this.chatY1 = 50;
                        TweenLite.to(this, .7, {
                            chatY1: 0,
                            ease: "Elastic.easeOut",
                            delay: 1
                        });
                    } else {
                        this.chatY0 = 50;
                        TweenLite.to(this, .7, {
                            chatY0: 0,
                            ease: "Elastic.easeOut",
                            delay: 1
                        });
                        this.chatY1 = 50;
                        TweenLite.to(this, .7, {
                            chatY1: 0,
                            ease: "Elastic.easeOut",
                            delay: .5
                        });
                    }
                    break;
                case "gameComplete":
                    this.chatY0 = 50;
                    TweenLite.to(this, .7, {
                        chatY0: 0,
                        ease: "Elastic.easeOut",
                        delay: 1
                    });
                    this.flareScale = 0;
                    TweenLite.to(this, .5, {
                        flareScale: 1,
                        ease: "Cubic.easeOut"
                    });
                    this.headerX = -700;
                    TweenLite.to(this, .7, {
                        headerX: 0,
                        ease: "Cubic.easeOut"
                    });
                    this.tweenY0 = -300;
                    TweenLite.to(this, .7, {
                        tweenY0: 0,
                        ease: "Cubic.easeOut"
                    });
                    this.char0Y = 0;
                    this.char1Y = 0;
                    if(oGameData.userScore > oGameData.enemyScore) {
                        this.char0X = -700;
                        TweenLite.to(this, .5, {
                            char0X: -130,
                            ease: "Back.easeOut"
                        });
                        this.char1X = 700;
                        TweenLite.to(this, 1.5, {
                            char1X: 130,
                            ease: "Cubic.easeOut",
                            onComplete: function () {
                            }
                        });
                    } else {
                        this.endChatWinId = getEndChatId();
                        this.char1X = 700;
                        this.char0X = -700;
                        TweenLite.to(this, 1.5, {
                            char0X: -130,
                            ease: "Cubic.easeOut",
                            onComplete: function () {
                            }
                        });
                        TweenLite.to(this, .5, {
                            char1X: 130,
                            ease: "Back.easeOut"
                        });
                    }
                    break;
                case "pause":
                    this.tweenY0 = 300;
                    TweenLite.to(this, .5, {
                        tweenY0: 0,
                        ease: "Cubic.easeOut"
                    });
                    break;
                case "game":
                    this.char0X = -200;
                    this.curCharTween = TweenLite.to(this, 1, {
                        char0X: 0,
                        ease: "Cubic.easeOut"
                    });
                    this.char1X = -200;
                    this.opCharTween = TweenLite.to(this, 1, {
                        char1X: 0,
                        ease: "Cubic.easeOut"
                    });
                    break;
                case "tournamentWin":
                    this.headerX = -700;
                    TweenLite.to(this, .7, {
                        headerX: 0,
                        ease: "Cubic.easeOut"
                    });
                    this.tweenY0 = -300;
                    TweenLite.to(this, .7, {
                        tweenY0: 0,
                        ease: "Cubic.easeOut"
                    });
                    this.chatY0 = 50;
                    TweenLite.to(this, .7, {
                        chatY0: 0,
                        ease: "Elastic.easeOut",
                        delay: 1.2
                    });
                    this.char0X = -700;
                    TweenLite.to(this, 1, {
                        char0X: 0,
                        ease: "Cubic.easeOut",
                        delay: .5
                    });
                    this.flareScale = 0;
                    TweenLite.to(this, .5, {
                        flareScale: 1,
                        ease: "Cubic.easeOut",
                        delay: .5
                    });
                    break;
            }
            this.butsY = 500;
            TweenLite.to(this, .5, {
                butsY: 0,
                ease: "Cubic.easeOut"
            });
        };
        Panel.prototype.tweenGameChar = function (_player) {
            var _this = this;
            if(_player == 0) {
                if(this.curCharTween) {
                    this.curCharTween.kill();
                }
                this.char0X = 0;
                this.curCharTween = TweenLite.to(this, .3, {
                    char0X: 50,
                    ease: "Cubic.easeOut",
                    onComplete: function () {
                        _this.curCharTween = TweenLite.to(_this, .7, {
                            char0X: 0,
                            ease: "Bounce.easeOut"
                        });
                    }
                });
            } else {
                if(this.opCharTween) {
                    this.opCharTween.kill();
                }
                this.char1X = 0;
                this.opCharTween = TweenLite.to(this, .3, {
                    char1X: 50,
                    ease: "Cubic.easeOut",
                    onComplete: function () {
                        _this.opCharTween = TweenLite.to(_this, .7, {
                            char1X: 0,
                            ease: "Bounce.easeOut"
                        });
                    }
                });
            }
        };
        Panel.prototype.tweenInChar = function (_side) {
            var _this = this;
            if(_side == 2) {
                if(this.curCharTween) {
                    this.curCharTween.kill();
                }
                this.char0X = -700;
                this.curCharTween = TweenLite.to(this, .7, {
                    char0X: 0,
                    ease: "Back.easeOut"
                });
                this.headerX = 700;
                TweenLite.to(this, .3, {
                    headerX: 0,
                    ease: "Cubic.easeOut"
                });
                if(this.promptTween) {
                    this.promptTween.kill();
                }
                this.promptTween = TweenLite.to(this, .2, {
                    tweenY1: -(canvas.height / 2 + 200),
                    ease: "Quad.easeIn",
                    onComplete: function () {
                        _this.promptOffScreen = true;
                    }
                });
                return;
            }
            if(gameType == 0) {
                if(this.curCharTween) {
                    this.curCharTween.kill();
                }
                this.char0X = -700;
                this.curCharTween = TweenLite.to(this, .7, {
                    char0X: 0,
                    ease: "Back.easeOut"
                });
                this.headerX = 700;
                TweenLite.to(this, .3, {
                    headerX: 0,
                    ease: "Cubic.easeOut"
                });
                if(this.promptTween) {
                    this.promptTween.kill();
                }
                this.promptTween = TweenLite.to(this, .2, {
                    tweenY1: -(canvas.height / 2 + 200),
                    ease: "Quad.easeIn",
                    onComplete: function () {
                        _this.promptOffScreen = true;
                    }
                });
            } else {
                if(_side == 0) {
                    if(this.curCharTween) {
                        this.curCharTween.kill();
                    }
                    this.char0X = -700;
                    this.curCharTween = TweenLite.to(this, .7, {
                        char0X: -210,
                        ease: "Cubic.easeOut"
                    });
                    this.headerX = 700;
                    TweenLite.to(this, .7, {
                        headerX: 0,
                        ease: "Cubic.easeOut"
                    });
                    if(this.promptTween) {
                        this.promptTween.kill();
                    }
                    this.tweenY1 = -(canvas.height / 2 + 200);
                    this.promptTween = TweenLite.to(this, .5, {
                        tweenY1: 0,
                        ease: "Cubic.easeOut"
                    });
                } else if(_side == 1) {
                    if(this.curCharTween) {
                        this.curCharTween.kill();
                    }
                    this.curCharTween = TweenLite.to(this, .7, {
                        char0X: -130,
                        ease: "Cubic.easeInOut"
                    });
                    this.flareScale = 0;
                    if(this.opCharTween) {
                        this.opCharTween.kill();
                    }
                    this.char1X = 700;
                    this.opCharTween = TweenLite.to(this, .7, {
                        char1X: 130,
                        flareScale: 1,
                        ease: "Quint.easeOut"
                    });
                    if(this.promptTween) {
                        this.promptTween.kill();
                    }
                    this.promptTween = TweenLite.to(this, .2, {
                        tweenY1: -(canvas.height / 2 + 200),
                        ease: "Quad.easeIn",
                        onComplete: function () {
                            _this.promptOffScreen = true;
                        }
                    });
                }
            }
        };
        Panel.prototype.tweenOffChars = function () {
            var _this = this;
            this.tweenY1 = -(canvas.height / 2 + 100);
            if(this.promptTween) {
                this.promptTween.kill();
            }
            if(this.charSelectState == 1) {
                TweenLite.to(this, .3, {
                    headerX: 700,
                    flareScale: 0,
                    ease: "Cubic.easeIn"
                });
                if(this.opCharTween) {
                    this.opCharTween.kill();
                }
                this.opCharTween = TweenLite.to(this, .3, {
                    char1X: 700,
                    ease: "Cubic.easeIn"
                });
                if(this.curCharTween) {
                    this.curCharTween.kill();
                }
                this.curCharTween = -TweenLite.to(this, .3, {
                    char0X: -700,
                    ease: "Cubic.easeIn",
                    onComplete: function () {
                        _this.charSelectState = 0;
                        _this.promptOffScreen = false;
                        opChar = 99;
                        curChar = 99;
                        _this.promptTween = TweenLite.to(_this, .5, {
                            tweenY1: 0,
                            ease: "Cubic.easeOut"
                        });
                    }
                });
            }
        };
        Panel.prototype.startTween1 = function () {
            this.posY = 500;
            TweenLite.to(this, .5, {
                posY: 0,
                ease: "Cubic.easeOut"
            });
        };
        Panel.prototype.startTut = function () {
            var _this = this;
            this.userBatX = -50;
            this.userBatY = 85;
            this.enemyBatX = 0;
            this.enemyBatY = -130;
            this.ballX = 0;
            this.ballY = 19;
            TweenLite.to(this, .55, {
                delay: .35,
                userBatX: 50,
                userBatY: -60,
                ease: "Back.easeOut",
                onComplete: function () {
                    _this.movePlayerBat(0);
                }
            });
            TweenLite.to(this, .5, {
                delay: .8,
                enemyBatX: 50,
                ease: "Back.easeOut",
                onComplete: function () {
                }
            });
            this.ballHeight = 30;
            TweenLite.to(this, .55, {
                delay: .5,
                ballX: 30,
                ballY: -100,
                ease: "Linear.easeNone",
                onComplete: function () {
                }
            });
            TweenLite.to(this, .6, {
                delay: .6,
                ballHeight: -30,
                ease: "Quad.easeIn",
                onComplete: function () {
                }
            });
        };
        Panel.prototype.movePlayerBat = function (_id) {
            var _this = this;
            switch(_id) {
                case 0:
                    TweenLite.to(this, .5, {
                        userBatX: 130,
                        userBatY: 85,
                        ease: "Quad.easeInOut",
                        onComplete: function () {
                            _this.movePlayerBat(1);
                        }
                    });
                    TweenLite.to(this, .65, {
                        delay: .25,
                        ballX: 75,
                        ballY: 50,
                        ease: "Quad.easeIn",
                        onComplete: function () {
                            TweenLite.to(_this, .65, {
                                ballX: -20,
                                ballY: -100,
                                ease: "Quad.easeOut",
                                onComplete: function () {
                                }
                            });
                        }
                    });
                    TweenLite.to(this, .65, {
                        delay: .25,
                        ballHeight: 40,
                        ease: "Quad.easeIn",
                        onComplete: function () {
                            TweenLite.to(_this, .65, {
                                ballHeight: -30,
                                ease: "Quad.easeIn",
                                onComplete: function () {
                                }
                            });
                        }
                    });
                    break;
                case 1:
                    TweenLite.to(this, .5, {
                        delay: .3,
                        userBatX: -30,
                        userBatY: -60,
                        ease: "Back.easeOut",
                        onComplete: function () {
                            _this.movePlayerBat(2);
                        }
                    });
                    TweenLite.to(this, .5, {
                        delay: .8,
                        enemyBatX: -30,
                        ease: "Back.easeOut",
                        onComplete: function () {
                        }
                    });
                    break;
                case 2:
                    TweenLite.to(this, .5, {
                        userBatX: -130,
                        userBatY: 85,
                        ease: "Quad.easeInOut",
                        onComplete: function () {
                            _this.movePlayerBat(3);
                        }
                    });
                    TweenLite.to(this, .65, {
                        delay: .25,
                        ballX: -75,
                        ballY: 50,
                        ease: "Quad.easeIn",
                        onComplete: function () {
                            TweenLite.to(_this, .65, {
                                ballX: 20,
                                ballY: -100,
                                ease: "Quad.easeOut",
                                onComplete: function () {
                                }
                            });
                        }
                    });
                    TweenLite.to(this, .65, {
                        delay: .25,
                        ballHeight: 40,
                        ease: "Quad.easeIn",
                        onComplete: function () {
                            TweenLite.to(_this, .65, {
                                ballHeight: -30,
                                ease: "Quad.easeIn",
                                onComplete: function () {
                                }
                            });
                        }
                    });
                    break;
                case 3:
                    TweenLite.to(this, .5, {
                        delay: .3,
                        userBatX: 30,
                        userBatY: -60,
                        ease: "Back.easeOut",
                        onComplete: function () {
                            _this.movePlayerBat(0);
                        }
                    });
                    TweenLite.to(this, .5, {
                        delay: .8,
                        enemyBatX: 30,
                        ease: "Back.easeOut",
                        onComplete: function () {
                        }
                    });
                    break;
            }
        };
        Panel.prototype.cardTween = function (_player) {
            if(_player == "user") {
                this.userCardScale = .25;
                TweenLite.to(this, .5, {
                    userCardScale: 1,
                    ease: "Bounce.easeOut"
                });
            } else {
                this.enemyCardScale = .25;
                TweenLite.to(this, .5, {
                    enemyCardScale: 1,
                    ease: "Bounce.easeOut"
                });
            }
        };
        Panel.prototype.switchBut = function (_id0, _id1, _id1Over, _aNewAPos, _aNewAlign) {
            if (typeof _aNewAPos === "undefined") { _aNewAPos = null; }
            if (typeof _aNewAlign === "undefined") { _aNewAlign = null; }
            var oButData = null;
            for(var i = 0; i < this.aButs.length; i++) {
                if(this.aButs[i].id == _id0) {
                    this.aButs[i].id = _id1;
                    this.aButs[i].idOver = _id1Over;
                    oButData = this.aButs[i];
                    if(_aNewAPos) {
                        this.aButs[i].aPos = _aNewAPos;
                    }
                    if(_aNewAlign) {
                        this.aButs[i].align = _aNewAlign;
                    }
                }
            }
            return oButData;
        };
        Panel.prototype.render = function (_butsOnTop) {
            if (typeof _butsOnTop === "undefined") { _butsOnTop = true; }
            if(!_butsOnTop) {
                this.addButs(ctx);
            }
            switch(gameState) {
                case "splash":
                    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(this.oSplashLogoImgData.img, canvas.width / 2 - this.oSplashLogoImgData.img.width / 2, canvas.height / 2 - this.oSplashLogoImgData.img.height / 2 - this.posY);
                    break;
                case "start":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBarsBg].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBarsBg].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBarsBg].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBarsBg].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height / 2 - bHeight / 2 + this.tweenY0 / 2, canvas.width, bHeight);
                    var tempImgData = assetLib.getData("titleLogo");
                    ctx.drawImage(tempImgData.img, 0, 0, tempImgData.img.width, tempImgData.img.height, canvas.width / 2 - (tempImgData.img.width / 2), canvas.height / 2 - (tempImgData.img.height / 2) + this.tweenY0, tempImgData.img.width, tempImgData.img.height);
                    if(this.tweenY0 == 0) {
                        var tempImgData = assetLib.getData("titleLogoWhite");
                        this.flashInc += 1000 * delta;
                        var tempCropWidth = 50;
                        var tempCropPos = Math.min((this.flashInc) % 2000, tempImgData.img.width - tempCropWidth);
                        ctx.drawImage(tempImgData.img, tempCropPos, 0, tempCropWidth, tempImgData.img.height, canvas.width / 2 - tempImgData.img.width / 2 + tempCropPos, canvas.height / 2 - (tempImgData.img.height / 2) + this.tweenY0, tempCropWidth, tempImgData.img.height);
                    }
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cnLogo].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cnLogo].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cnLogo].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cnLogo].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height / 2 - 230 + this.tweenY0, bWidth, bHeight);
                    for(var i = 0; i < this.aTitleCharPos.length; i++) {
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar" + this.aTitleCharPos[i].id]].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar" + this.aTitleCharPos[i].id]].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar" + this.aTitleCharPos[i].id]].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["titleChar" + this.aTitleCharPos[i].id]].height;
                        var tx;
                        if(this.aTitleCharPos[i].side == 0) {
                            tx = this.aTitleCharPos[i].x;
                        } else {
                            tx = canvas.width + this.aTitleCharPos[i].x;
                        }
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, tx - bWidth / 2 + Math.sin(this.incY / 2 + i) * 4, canvas.height / 2 + this.aTitleCharPos[i].y - bHeight / 2, bWidth, bHeight);
                    }
                    addText(0, 25, 175, "center", canvas.width / 2 - 160, canvas.height / 2 + 205 - this.tweenY0, "tournament0", "#FFFFFF");
                    addText(0, 25, 175, "center", canvas.width / 2, canvas.height / 2 + 205 - this.tweenY0, "tournament1", "#FFFFFF");
                    addText(0, 25, 175, "center", canvas.width / 2 + 160, canvas.height / 2 + 205 - this.tweenY0, "quickGame", "#FFFFFF");
                    break;
                case "credits":
                    var tempImgData = assetLib.getData("info");
                    ctx.drawImage(tempImgData.img, 0, 0, tempImgData.img.width, tempImgData.img.height, canvas.width / 2 - tempImgData.img.width / 2, canvas.height / 2 - tempImgData.img.height / 2 + this.tweenY0, tempImgData.img.width, tempImgData.img.height);
                    addText(0, 20, 1000, "center", canvas.width / 2, canvas.height / 2 - 170 + this.tweenY0, "producedFor", "#FFFFFF");
                    addText(0, 20, 1000, "center", canvas.width / 2, canvas.height / 2 + 83 + this.tweenY0, "createdBy", "#FFFFFF");
                    addText(0, 20, 300, "right", canvas.width - 77, canvas.height - 34 + this.tweenY0, "resetGame", "#FFFFFF");
                    break;
                case "charSelect":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.selectBlueBg].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.selectBlueBg].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.selectBlueBg].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.selectBlueBg].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height / 2 + 36 + this.tweenY0 / 2, canvas.width, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height / 2 - 210 + this.tweenY0 * 2, canvas.width, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flameBarsBg].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flameBarsBg].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flameBarsBg].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flameBarsBg].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height / 2 - 158 + this.tweenY0, canvas.width, bHeight);
                    if(this.charSelectState == 0) {
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.selectPrompt0].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.selectPrompt0].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.selectPrompt0].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.selectPrompt0].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height / 2 - 96 + this.tweenY1 + Math.sin(this.incY / 2) * 8, bWidth, bHeight);
                        addText(0, 25, 160, "center", canvas.width / 2, canvas.height / 2 - 55 + this.tweenY1 + Math.sin(this.incY / 2) * 8, "selectPlayer", "#FFFFFF");
                    } else if(this.charSelectState == 1) {
                        if(gameType == 0 || curChar > 100) {
                            var tempId = curChar;
                            if(charLineUp == 0 && curChar == 6) {
                                tempId = 14;
                            }
                            addText(1, 36, 600, "center", canvas.width / 2 + this.headerX, canvas.height / 2 - 175, "char" + tempId, "#FFFFFF");
                        } else {
                            var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.vs].x;
                            var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.vs].y;
                            var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.vs].width;
                            var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.vs].height;
                            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + this.headerX, canvas.height / 2 - 224, bWidth, bHeight);
                            addText(1, 36, 300, "right", canvas.width / 2 - 50 + this.headerX, canvas.height / 2 - 175, "char" + curChar, "#FFFFFF");
                            var tempOpName = "???";
                            if(this.promptOffScreen) {
                                tempOpName = "char" + opChar;
                                var tempId = opChar;
                                if(charLineUp == 0 && tempId == 6) {
                                    tempId = 14;
                                    tempOpName = "char" + tempId;
                                }
                            }
                            addText(1, 36, 300, "left", canvas.width / 2 + 40 + this.headerX, canvas.height / 2 - 175, tempOpName, "#FFFFFF");
                        }
                        if(curChar != 99) {
                            if(this.flareScale > 0) {
                                this.flare(canvas.width / 2, canvas.height / 2 - 60, 4 * this.flareScale, 1.3 * this.flareScale, 1);
                            }
                            var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + curChar]].x;
                            var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + curChar]].y;
                            var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + curChar]].width;
                            var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + curChar]].height;
                            var tempCurChar = curChar;
                            if(curChar > 100) {
                                tempCurChar = curChar - 100;
                            }
                            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + this.char0X + Math.sin(this.incY / 5) * 4 + this.aZoomCharOffsetx[tempCurChar], canvas.height / 2 - bHeight + 36, bWidth, bHeight);
                            if(curChar < 100) {
                                ctx.save();
                                ctx.translate(canvas.width / 2 + this.char0X - 130, canvas.height / 2 - 65 + Math.sin(this.incY / 1.5) * 4);
                                ctx.rotate(16.5 * radian + Math.sin(this.incY / .7) * 0.02);
                                var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + curChar]].x;
                                var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + curChar]].y;
                                var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + curChar]].width;
                                var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + curChar]].height;
                                ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight / 2, bWidth, bHeight);
                                ctx.restore();
                            }
                        }
                        if(opChar != 99) {
                            var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + opChar]].x;
                            var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + opChar]].y;
                            var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + opChar]].width;
                            var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + opChar]].height;
                            ctx.save();
                            ctx.translate(canvas.width / 2 + this.char1X - Math.sin(this.incY / 5) * 4 - this.aZoomCharOffsetx[opChar], canvas.height / 2 + 36);
                            ctx.scale(-1, 1);
                            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight, bWidth, bHeight);
                            ctx.restore();
                            var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsPanel].x;
                            var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsPanel].y;
                            var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsPanel].width;
                            var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsPanel].height;
                            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 + this.char1X + 140, canvas.height / 2 - 150, bWidth, bHeight);
                            ctx.save();
                            ctx.translate(canvas.width / 2 + this.char1X + 130, canvas.height / 2 - 65 + Math.sin(this.incY / 1.5) * 4);
                            ctx.rotate(-16.5 * radian + Math.sin(this.incY / .7) * 0.02);
                            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + opChar]].x;
                            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + opChar]].y;
                            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + opChar]].width;
                            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + opChar]].height;
                            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight / 2, bWidth, bHeight);
                            ctx.restore();
                            for(var i = 0; i < 3; i++) {
                                var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsBarBg].x;
                                var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsBarBg].y;
                                var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsBarBg].width;
                                var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsBarBg].height;
                                ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 + this.char1X + 160, canvas.height / 2 - 117 + 48 * i, bWidth, bHeight);
                                var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsBar].x;
                                var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsBar].y;
                                var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsBar].width;
                                var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsBar].height;
                                ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth * aOpStats[opChar][i], bHeight, canvas.width / 2 + this.char1X + 163, canvas.height / 2 - 114 + 48 * i, bWidth * aOpStats[opChar][i], bHeight);
                                addText(0, 20, 75, "left", canvas.width / 2 + this.char1X + 187, canvas.height / 2 - 123 + 48 * i, "stat" + i, "#FFFFFF");
                            }
                        }
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.selectPrompt1].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.selectPrompt1].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.selectPrompt1].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.selectPrompt1].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + 3, canvas.height / 2 - 96 + this.tweenY1 + Math.sin(this.incY / 2) * 8, bWidth, bHeight);
                        addText(0, 25, 160, "center", canvas.width / 2, canvas.height / 2 - 55 + this.tweenY1 + Math.sin(this.incY / 2) * 8, "selectOpponent", "#FFFFFF");
                    }
                    break;
                case "progress":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height / 2 - 210 + this.tweenY0 * 1, canvas.width, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height / 2 + 210 - bHeight + this.tweenY0 * 3, canvas.width, bHeight);
                    var temp = saveDataHandler.getNextLevel(curChar);
                    var tempText = "firstRound";
                    if(temp > 0 && temp <= tournamentSize - 2) {
                        tempText = "nextRound";
                    } else if(temp >= tournamentSize - 1) {
                        tempText = "finalRound";
                    }
                    var tempMidOffset = 30;
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flameBarsBg].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flameBarsBg].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flameBarsBg].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flameBarsBg].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height / 2 - bHeight / 2 + this.tweenY0 * 2 + tempMidOffset, canvas.width, bHeight);
                    if(this.char0X < 1000) {
                        var tempOffset = -temp * this.progressCharGap + canvas.width / 2;
                        for(var i = tournamentSize - 1; i >= 0; i--) {
                            if(i < temp) {
                                var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + aTournamentOrder[i]]].x;
                                var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + aTournamentOrder[i]]].y;
                                var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + aTournamentOrder[i]]].width;
                                var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + aTournamentOrder[i]]].height;
                                ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, this.progressCharGap * i - (bWidth / 2 - this.aZoomCharOffsetx[aTournamentOrder[i]]) * .48 + tempOffset + this.char0X * (1 + i / 8) - this.tweenY1 * 200, canvas.height / 2 + 94 - bHeight * .48 + tempMidOffset, bWidth * .48, bHeight * .48);
                                var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cross].x;
                                var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cross].y;
                                var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cross].width;
                                var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cross].height;
                                ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, this.progressCharGap * i - bWidth / 2 + tempOffset + this.char0X * (1 + i / 8) - this.tweenY1 * 200, canvas.height / 2 + 94 - bHeight / 2 + tempMidOffset, bWidth, bHeight);
                            } else if(i > temp) {
                                var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["silChar" + aTournamentOrder[i]]].x;
                                var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["silChar" + aTournamentOrder[i]]].y;
                                var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["silChar" + aTournamentOrder[i]]].width;
                                var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["silChar" + aTournamentOrder[i]]].height;
                                ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, this.progressCharGap * i - bWidth / 2 - this.aZoomCharOffsetx[aTournamentOrder[i]] * .48 + tempOffset + this.char0X * (1 + i / 8) + this.tweenY1 * 200, canvas.height / 2 + 94 - bHeight + tempMidOffset, bWidth, bHeight);
                            } else {
                                if(this.charScale > 0) {
                                    if(this.flareScale > 0) {
                                        this.flare(canvas.width / 2, canvas.height / 2 + tempMidOffset, 4 * this.flareScale, 1.5 * this.flareScale, 1);
                                    }
                                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + aTournamentOrder[i]]].x;
                                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + aTournamentOrder[i]]].y;
                                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + aTournamentOrder[i]]].width;
                                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + aTournamentOrder[i]]].height;
                                    ctx.save();
                                    ctx.translate(this.progressCharGap * i - this.aZoomCharOffsetx[aTournamentOrder[i]] + tempOffset + this.char0X * (1 + i / 8), canvas.height / 2 + 94 + tempMidOffset);
                                    ctx.scale(-this.charScale, this.charScale);
                                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight, bWidth, bHeight);
                                    ctx.restore();
                                    var tempScore = (temp + 1).toString();
                                    var tempScale = .6;
                                    if(tempScore.length < 2) {
                                        tempScore = "0" + tempScore;
                                    }
                                    for(var j = 0; j < tempScore.length; j++) {
                                        var id = parseFloat(tempScore.charAt(j));
                                        var imgX = (id * this.oFireNumbersImgData.oData.spriteWidth) % this.oFireNumbersImgData.img.width;
                                        var imgY = Math.floor(id / (this.oFireNumbersImgData.img.width / this.oFireNumbersImgData.oData.spriteWidth)) * this.oFireNumbersImgData.oData.spriteHeight;
                                        ctx.drawImage(this.oFireNumbersImgData.img, imgX, imgY, this.oFireNumbersImgData.oData.spriteWidth, this.oFireNumbersImgData.oData.spriteHeight, 10 + j * this.fireNumberSpace * tempScale + this.char1X, 10, this.oFireNumbersImgData.oData.spriteWidth * tempScale, this.oFireNumbersImgData.oData.spriteHeight * tempScale);
                                    }
                                    tempScale = .3;
                                    var id = 11;
                                    var imgX = (id * this.oFireNumbersImgData.oData.spriteWidth) % this.oFireNumbersImgData.img.width;
                                    var imgY = Math.floor(id / (this.oFireNumbersImgData.img.width / this.oFireNumbersImgData.oData.spriteWidth)) * this.oFireNumbersImgData.oData.spriteHeight;
                                    ctx.drawImage(this.oFireNumbersImgData.img, imgX, imgY, this.oFireNumbersImgData.oData.spriteWidth, this.oFireNumbersImgData.oData.spriteHeight, 84 + this.char1X, 10, this.oFireNumbersImgData.oData.spriteWidth * tempScale, this.oFireNumbersImgData.oData.spriteHeight * tempScale);
                                    var tempScore = tournamentSize.toString();
                                    if(tempScore.length < 2) {
                                        tempScore = "0" + tempScore;
                                    }
                                    for(var j = 0; j < tempScore.length; j++) {
                                        var id = parseFloat(tempScore.charAt(j));
                                        var imgX = (id * this.oFireNumbersImgData.oData.spriteWidth) % this.oFireNumbersImgData.img.width;
                                        var imgY = Math.floor(id / (this.oFireNumbersImgData.img.width / this.oFireNumbersImgData.oData.spriteWidth)) * this.oFireNumbersImgData.oData.spriteHeight;
                                        ctx.drawImage(this.oFireNumbersImgData.img, imgX, imgY, this.oFireNumbersImgData.oData.spriteWidth, this.oFireNumbersImgData.oData.spriteHeight, 100 + j * this.fireNumberSpace * tempScale + this.char1X, 10, this.oFireNumbersImgData.oData.spriteWidth * tempScale, this.oFireNumbersImgData.oData.spriteHeight * tempScale);
                                    }
                                    var tempId = opChar;
                                    if(charLineUp == 0 && tempId == 6) {
                                        tempId = 14;
                                    }
                                    addText(1, 100, 600, "center", canvas.width / 2 - this.char1X, canvas.height / 2 - 155, "char" + tempId, "#FFFFFF");
                                } else {
                                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["silChar" + aTournamentOrder[i]]].x;
                                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["silChar" + aTournamentOrder[i]]].y;
                                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["silChar" + aTournamentOrder[i]]].width;
                                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["silChar" + aTournamentOrder[i]]].height;
                                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, this.progressCharGap * i - bWidth / 2 - this.aZoomCharOffsetx[aTournamentOrder[i]] * .48 + tempOffset + this.char0X * (1 + i / 8), canvas.height / 2 + 94 - bHeight + tempMidOffset, bWidth, bHeight);
                                }
                            }
                        }
                    }
                    addText(1, 36, 700, "center", canvas.width / 2, canvas.height / 2 + 202 + this.tweenY0 * 3, tempText, "#FFFFFF");
                    break;
                case "gameIntro":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height / 2 - 210, canvas.width, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height / 2 + 210 - bHeight, canvas.width, bHeight);
                    var tempMidOffset = 30;
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flameBarsBg].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flameBarsBg].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flameBarsBg].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flameBarsBg].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height / 2 - bHeight / 2 + tempMidOffset, canvas.width, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.vs].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.vs].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.vs].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.vs].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 - this.headerX, canvas.height / 2 - 224, bWidth, bHeight);
                    var tempId = curChar;
                    if(charLineUp == 0 && tempId == 6) {
                        tempId = 14;
                    }
                    addText(1, 36, 300, "right", canvas.width / 2 - 50 - this.headerX, canvas.height / 2 - 175, "char" + tempId, "#FFFFFF");
                    tempId = opChar;
                    if(charLineUp == 0 && tempId == 6) {
                        tempId = 14;
                    }
                    addText(1, 36, 300, "left", canvas.width / 2 + 40 - this.headerX, canvas.height / 2 - 175, "char" + tempId, "#FFFFFF");
                    if(this.flareScale > 0) {
                        this.flare(canvas.width / 2, canvas.height / 2 + tempMidOffset, 4 * this.flareScale, 1.5 * this.flareScale, 1);
                    }
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + curChar]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + curChar]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + curChar]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + curChar]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2 + this.char0X + Math.sin(this.incY / 5) * 4 + this.aZoomCharOffsetx[curChar], canvas.height / 2 - bHeight + 92 + tempMidOffset, bWidth, bHeight);
                    ctx.save();
                    ctx.translate(canvas.width / 2 + this.char0X - 130, canvas.height / 2 - 9 + Math.sin(this.incY / 1.5) * 4 + tempMidOffset);
                    ctx.rotate(16.5 * radian + Math.sin(this.incY / .7) * 0.02);
                    var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + curChar]].x;
                    var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + curChar]].y;
                    var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + curChar]].width;
                    var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + curChar]].height;
                    ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight / 2, bWidth, bHeight);
                    ctx.restore();
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + opChar]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + opChar]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + opChar]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + opChar]].height;
                    ctx.save();
                    ctx.translate(canvas.width / 2 + this.char1X - Math.sin(this.incY / 5) * 4 - this.aZoomCharOffsetx[opChar], canvas.height / 2 + 92 + tempMidOffset);
                    ctx.scale(-1, 1);
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight, bWidth, bHeight);
                    ctx.restore();
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsPanel].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsPanel].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsPanel].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsPanel].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 + this.char1X + 140 - this.headerX, canvas.height / 2 - 94 + tempMidOffset, bWidth, bHeight);
                    ctx.save();
                    ctx.translate(canvas.width / 2 + this.char1X + 130 - this.headerX, canvas.height / 2 - 9 + Math.sin(this.incY / 1.5) * 4 + tempMidOffset);
                    ctx.rotate(-16.5 * radian + Math.sin(this.incY / .7) * 0.02);
                    var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + opChar]].x;
                    var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + opChar]].y;
                    var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + opChar]].width;
                    var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + opChar]].height;
                    ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight / 2, bWidth, bHeight);
                    ctx.restore();
                    for(var i = 0; i < 3; i++) {
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsBarBg].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsBarBg].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsBarBg].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsBarBg].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 + this.char1X + 160 - this.headerX, canvas.height / 2 - 61 + 48 * i + tempMidOffset, bWidth, bHeight);
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsBar].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsBar].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsBar].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.statsBar].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth * aOpStats[opChar][i], bHeight, canvas.width / 2 + this.char1X + 163 - this.headerX, canvas.height / 2 - 58 + 48 * i + tempMidOffset, bWidth * aOpStats[opChar][i], bHeight);
                        addText(0, 20, 75, "left", canvas.width / 2 + this.char1X + 187 - this.headerX, canvas.height / 2 - 67 + 48 * i + tempMidOffset, "stat" + i, "#FFFFFF");
                        var tempChat = 0;
                        var tempSide = "preMatchConvLeft";
                        var tempHeight = -110;
                        var tempTOffset = 29;
                        if(this.chatOrder == 1) {
                            tempChat = 1;
                            tempHeight = 113;
                            tempTOffset = 86;
                        }
                        if(this.chatFlip) {
                            tempSide = "preMatchConvRight";
                        }
                        if(this.chatY0 < 50) {
                            var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempSide + tempChat]].x;
                            var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempSide + tempChat]].y;
                            var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempSide + tempChat]].width;
                            var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempSide + tempChat]].height;
                            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height / 2 - bHeight / 2 + tempHeight + this.chatY0 + tempMidOffset, bWidth, bHeight);
                            addText(2, 25, 587, "center", canvas.width / 2, canvas.height / 2 - bHeight / 2 + tempHeight + tempTOffset + this.chatY0 + tempMidOffset, this.getStartChatName() + "A", "#000000");
                        }
                        tempSide = "preMatchConvRight";
                        if(this.chatOrder == 0) {
                            tempChat = 1;
                            tempHeight = 113;
                            tempTOffset = 86;
                        } else {
                            tempChat = 0;
                            tempHeight = -110;
                            tempTOffset = 29;
                        }
                        if(this.chatFlip) {
                            tempSide = "preMatchConvLeft";
                        }
                        if(this.chatY1 < 50) {
                            var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempSide + tempChat]].x;
                            var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempSide + tempChat]].y;
                            var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempSide + tempChat]].width;
                            var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempSide + tempChat]].height;
                            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height / 2 - bHeight / 2 + tempHeight - this.chatY1 + tempMidOffset, bWidth, bHeight);
                            addText(2, 25, 587, "center", canvas.width / 2, canvas.height / 2 - bHeight / 2 + tempHeight + tempTOffset - this.chatY1 + tempMidOffset, this.getStartChatName() + "B", "#000000");
                        }
                    }
                    var temp = saveDataHandler.getNextLevel(curChar);
                    var tempScore = (temp + 1).toString();
                    var tempScale = .6;
                    if(tempScore.length < 2) {
                        tempScore = "0" + tempScore;
                    }
                    for(var j = 0; j < tempScore.length; j++) {
                        var id = parseFloat(tempScore.charAt(j));
                        var imgX = (id * this.oFireNumbersImgData.oData.spriteWidth) % this.oFireNumbersImgData.img.width;
                        var imgY = Math.floor(id / (this.oFireNumbersImgData.img.width / this.oFireNumbersImgData.oData.spriteWidth)) * this.oFireNumbersImgData.oData.spriteHeight;
                        ctx.drawImage(this.oFireNumbersImgData.img, imgX, imgY, this.oFireNumbersImgData.oData.spriteWidth, this.oFireNumbersImgData.oData.spriteHeight, 10 + j * this.fireNumberSpace * tempScale, 10, this.oFireNumbersImgData.oData.spriteWidth * tempScale, this.oFireNumbersImgData.oData.spriteHeight * tempScale);
                    }
                    tempScale = .3;
                    var id = 11;
                    var imgX = (id * this.oFireNumbersImgData.oData.spriteWidth) % this.oFireNumbersImgData.img.width;
                    var imgY = Math.floor(id / (this.oFireNumbersImgData.img.width / this.oFireNumbersImgData.oData.spriteWidth)) * this.oFireNumbersImgData.oData.spriteHeight;
                    ctx.drawImage(this.oFireNumbersImgData.img, imgX, imgY, this.oFireNumbersImgData.oData.spriteWidth, this.oFireNumbersImgData.oData.spriteHeight, 84, 10, this.oFireNumbersImgData.oData.spriteWidth * tempScale, this.oFireNumbersImgData.oData.spriteHeight * tempScale);
                    var tempScore = tournamentSize.toString();
                    if(tempScore.length < 2) {
                        tempScore = "0" + tempScore;
                    }
                    for(var j = 0; j < tempScore.length; j++) {
                        var id = parseFloat(tempScore.charAt(j));
                        var imgX = (id * this.oFireNumbersImgData.oData.spriteWidth) % this.oFireNumbersImgData.img.width;
                        var imgY = Math.floor(id / (this.oFireNumbersImgData.img.width / this.oFireNumbersImgData.oData.spriteWidth)) * this.oFireNumbersImgData.oData.spriteHeight;
                        ctx.drawImage(this.oFireNumbersImgData.img, imgX, imgY, this.oFireNumbersImgData.oData.spriteWidth, this.oFireNumbersImgData.oData.spriteHeight, 100 + j * this.fireNumberSpace * tempScale, 10, this.oFireNumbersImgData.oData.spriteWidth * tempScale, this.oFireNumbersImgData.oData.spriteHeight * tempScale);
                    }
                    break;
                case "game":
                    var tempScale = this.char0X * .03;
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flare0].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flare0].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flare0].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flare0].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, this.char0X + 50 - (bWidth / 2) * tempScale, 160 - (bHeight / 2) * tempScale, bWidth * tempScale, bHeight * tempScale);
                    var tempScale = this.char1X * .03;
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flare0].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flare0].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flare0].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flare0].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width - 50 - this.char1X - (bWidth / 2) * tempScale, 160 - (bHeight / 2) * tempScale, bWidth * tempScale, bHeight * tempScale);
                    var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["gameChar" + curChar]].x;
                    var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["gameChar" + curChar]].y;
                    var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["gameChar" + curChar]].width;
                    var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["gameChar" + curChar]].height;
                    ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, 0 - 10 + this.char0X, 85, bWidth, bHeight);
                    ctx.save();
                    var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["gameChar" + opChar]].x;
                    var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["gameChar" + opChar]].y;
                    var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["gameChar" + opChar]].width;
                    var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["gameChar" + opChar]].height;
                    ctx.translate(canvas.width + 10 - this.char1X, 85);
                    ctx.scale(-1, 1);
                    ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, 0, 0, bWidth, bHeight);
                    ctx.restore();
                    var tempScore = oGameData.userScore.toString();
                    tempScale = .8 * (this.char0X / 100 + 1);
                    if(tempScore.length < 2) {
                        tempScore = "0" + tempScore;
                    }
                    for(var i = 0; i < tempScore.length; i++) {
                        var id = parseFloat(tempScore.charAt(i));
                        var imgX = (id * this.oFireNumbersImgData.oData.spriteWidth) % this.oFireNumbersImgData.img.width;
                        var imgY = Math.floor(id / (this.oFireNumbersImgData.img.width / this.oFireNumbersImgData.oData.spriteWidth)) * this.oFireNumbersImgData.oData.spriteHeight;
                        ctx.drawImage(this.oFireNumbersImgData.img, imgX, imgY, this.oFireNumbersImgData.oData.spriteWidth, this.oFireNumbersImgData.oData.spriteHeight, 45 + i * this.fireNumberSpace * tempScale - (tempScore.length * (this.fireNumberSpace * tempScale)) / 2 + this.char0X * .75, 230 + this.char0X / 3, this.oFireNumbersImgData.oData.spriteWidth * tempScale, this.oFireNumbersImgData.oData.spriteHeight * tempScale);
                    }
                    var tempScore = oGameData.enemyScore.toString();
                    tempScale = .8 * (this.char1X / 100 + 1);
                    if(tempScore.length < 2) {
                        tempScore = "0" + tempScore;
                    }
                    for(var i = 0; i < tempScore.length; i++) {
                        var id = parseFloat(tempScore.charAt(i));
                        var imgX = (id * this.oFireNumbersImgData.oData.spriteWidth) % this.oFireNumbersImgData.img.width;
                        var imgY = Math.floor(id / (this.oFireNumbersImgData.img.width / this.oFireNumbersImgData.oData.spriteWidth)) * this.oFireNumbersImgData.oData.spriteHeight;
                        ctx.drawImage(this.oFireNumbersImgData.img, imgX, imgY, this.oFireNumbersImgData.oData.spriteWidth, this.oFireNumbersImgData.oData.spriteHeight, canvas.width - 70 + i * this.fireNumberSpace * tempScale - (tempScore.length * (this.fireNumberSpace * tempScale)) / 2 - this.char1X * .75, 230 + this.char1X / 3, this.oFireNumbersImgData.oData.spriteWidth * tempScale, this.oFireNumbersImgData.oData.spriteHeight * tempScale);
                    }
                    if(firstRun) {
                        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.tutScreen].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.tutScreen].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.tutScreen].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.tutScreen].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height / 2 - bHeight / 2 - this.posY / 2, bWidth, bHeight);
                        var tempId = 0;
                        var tempScale = .2;
                        ctx.save();
                        ctx.translate(canvas.width / 2 + this.enemyBatX, canvas.height / 2 + this.enemyBatY - this.posY / 2);
                        ctx.rotate(this.enemyBatX / 100);
                        ctx.scale(tempScale * 2, tempScale * 2);
                        var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["opBat" + opChar]].x;
                        var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["opBat" + opChar]].y;
                        var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["opBat" + opChar]].width;
                        var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["opBat" + opChar]].height;
                        ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight / 3, bWidth, bHeight);
                        ctx.restore();
                        tempScale = .4;
                        if(this.ballY < 20) {
                            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ballShadow].x;
                            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ballShadow].y;
                            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ballShadow].width;
                            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ballShadow].height;
                            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 + this.ballX - (bWidth / 2) * tempScale, canvas.height / 2 + this.ballY - (bHeight / 2) * tempScale - this.posY / 2, bWidth * tempScale, bHeight * tempScale);
                        }
                        tempScale = .4;
                        var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ball].x;
                        var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ball].y;
                        var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ball].width;
                        var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ball].height;
                        ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 + this.ballX - (bWidth / 2) * tempScale, canvas.height / 2 + this.ballY - (bHeight) * tempScale - this.posY / 2 - Math.abs(this.ballHeight), bWidth * tempScale, bHeight * tempScale);
                        var tempId = 4;
                        var tempScale = .45;
                        ctx.save();
                        ctx.translate(canvas.width / 2 + this.userBatX, canvas.height / 2 + this.userBatY - this.posY / 2);
                        ctx.rotate(this.userBatX / 100);
                        ctx.scale(tempScale * 2, tempScale * 2);
                        var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["opBat" + curChar]].x;
                        var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["opBat" + curChar]].y;
                        var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["opBat" + curChar]].width;
                        var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["opBat" + curChar]].height;
                        ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight / 2, bWidth, bHeight);
                        ctx.restore();
                        tempScale = .4;
                        var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.finger].x;
                        var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.finger].y;
                        var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.finger].width;
                        var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.finger].height;
                        ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 + this.userBatX, canvas.height / 2 + this.userBatY - this.posY / 2, bWidth, bHeight);
                        var tempTut = 0;
                        if(tournamentSize == 13) {
                            tempTut = 1;
                        }
                        addText(1, 30, 440, "center", canvas.width / 2, canvas.height / 2 - 170, "tut" + tempTut, "#FFFFFF");
                    }
                    break;
                case "gameComplete":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height / 2 - 210 + this.tweenY0 * 1, canvas.width, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height / 2 + 210 - bHeight + this.tweenY0 * 3, canvas.width, bHeight);
                    var tempMidOffset = 30;
                    var tempBg = "loseBarsBg";
                    if(oGameData.userScore > oGameData.enemyScore) {
                        tempBg = "winBarsBg";
                    }
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempBg]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempBg]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempBg]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempBg]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height / 2 - bHeight / 2 + this.tweenY0 * 2 + tempMidOffset, canvas.width, bHeight);
                    var tempScore = oGameData.userScore.toString();
                    var tempScale = 1;
                    if(tempScore.length < 2) {
                        tempScore = "0" + tempScore;
                    }
                    for(var j = 0; j < tempScore.length; j++) {
                        var id = parseFloat(tempScore.charAt(j));
                        var imgX = (id * this.oFireNumbersImgData.oData.spriteWidth) % this.oFireNumbersImgData.img.width;
                        var imgY = Math.floor(id / (this.oFireNumbersImgData.img.width / this.oFireNumbersImgData.oData.spriteWidth)) * this.oFireNumbersImgData.oData.spriteHeight;
                        ctx.drawImage(this.oFireNumbersImgData.img, imgX, imgY, this.oFireNumbersImgData.oData.spriteWidth, this.oFireNumbersImgData.oData.spriteHeight, canvas.width / 2 + j * this.fireNumberSpace * tempScale - tempScore.length * (this.fireNumberSpace * tempScale) - 42, canvas.height / 2 - 240 + this.tweenY0 * 1, this.oFireNumbersImgData.oData.spriteWidth * tempScale, this.oFireNumbersImgData.oData.spriteHeight * tempScale);
                    }
                    var id = 10;
                    var imgX = (id * this.oFireNumbersImgData.oData.spriteWidth) % this.oFireNumbersImgData.img.width;
                    var imgY = Math.floor(id / (this.oFireNumbersImgData.img.width / this.oFireNumbersImgData.oData.spriteWidth)) * this.oFireNumbersImgData.oData.spriteHeight;
                    ctx.drawImage(this.oFireNumbersImgData.img, imgX, imgY, this.oFireNumbersImgData.oData.spriteWidth, this.oFireNumbersImgData.oData.spriteHeight, canvas.width / 2 - this.oFireNumbersImgData.oData.spriteWidth / 2, canvas.height / 2 - 240 + this.tweenY0 * 1, this.oFireNumbersImgData.oData.spriteWidth * tempScale, this.oFireNumbersImgData.oData.spriteHeight * tempScale);
                    var tempScore = oGameData.enemyScore.toString();
                    if(tempScore.length < 2) {
                        tempScore = "0" + tempScore;
                    }
                    for(var j = 0; j < tempScore.length; j++) {
                        var id = parseFloat(tempScore.charAt(j));
                        var imgX = (id * this.oFireNumbersImgData.oData.spriteWidth) % this.oFireNumbersImgData.img.width;
                        var imgY = Math.floor(id / (this.oFireNumbersImgData.img.width / this.oFireNumbersImgData.oData.spriteWidth)) * this.oFireNumbersImgData.oData.spriteHeight;
                        ctx.drawImage(this.oFireNumbersImgData.img, imgX, imgY, this.oFireNumbersImgData.oData.spriteWidth, this.oFireNumbersImgData.oData.spriteHeight, canvas.width / 2 + j * this.fireNumberSpace * tempScale + 8, canvas.height / 2 - 240 + this.tweenY0 * 1, this.oFireNumbersImgData.oData.spriteWidth * tempScale, this.oFireNumbersImgData.oData.spriteHeight * tempScale);
                    }
                    var tempId = curChar;
                    if(charLineUp == 0 && tempId == 6) {
                        tempId = 14;
                    }
                    addText(1, 36, 200, "right", canvas.width / 2 - 150, canvas.height / 2 - 175 + this.tweenY0 * 1, "char" + tempId, "#FFFFFF");
                    tempId = opChar;
                    if(charLineUp == 0 && tempId == 6) {
                        tempId = 14;
                    }
                    addText(1, 36, 200, "left", canvas.width / 2 + 140, canvas.height / 2 - 175 + this.tweenY0 * 1, "char" + tempId, "#FFFFFF");
                    var tempWinner = opChar;
                    if(charLineUp == 0 && tempWinner == 6) {
                        tempWinner = 14;
                    }
                    var tempEndChat = "endChatWin" + opChar.toString() + this.endChatWinId;
                    if(oGameData.userScore > oGameData.enemyScore) {
                        tempWinner = curChar;
                        if(charLineUp == 0 && tempWinner == 6) {
                            tempWinner = 14;
                        }
                        var tempEndChat = "endChatLose" + opChar;
                        if(this.flareScale > 0) {
                            this.flare(canvas.width / 2 + this.char0X + Math.sin(this.incY / 5) * 4 + this.aZoomCharOffsetx[curChar], canvas.height / 2 + tempMidOffset, 2 * this.flareScale, 2 * this.flareScale, 0);
                        }
                        this.char0Y = -Math.abs(Math.sin(this.incY / 2) * 10) + 10;
                    } else {
                        if(this.flareScale > 0) {
                            this.flare(canvas.width / 2 + this.char1X - Math.sin(this.incY / 5) * 4 - this.aZoomCharOffsetx[opChar], canvas.height / 2 + tempMidOffset, 2 * this.flareScale, 2 * this.flareScale, 0);
                        }
                        this.char1Y = -Math.abs(Math.sin(this.incY / 2) * 10) + 10;
                    }
                    if(charLineUp == 0 && tempWinner == 6) {
                        tempWinner = 14;
                    }
                    addText(1, 36, 450, "center", canvas.width / 2, canvas.height / 2 + 202 + this.tweenY0 * 3, "win" + tempWinner, "#FFFFFF");
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + curChar]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + curChar]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + curChar]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + curChar]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight - this.char0Y, canvas.width / 2 - bWidth / 2 + this.char0X + this.aZoomCharOffsetx[curChar], canvas.height / 2 - bHeight + 92 + tempMidOffset + this.char0Y, bWidth, bHeight - this.char0Y);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + opChar]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + opChar]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + opChar]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + opChar]].height;
                    ctx.save();
                    ctx.translate(canvas.width / 2 + this.char1X - this.aZoomCharOffsetx[opChar], canvas.height / 2 + 92 + tempMidOffset + this.char1Y);
                    ctx.scale(-1, 1);
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight - this.char1Y, -bWidth / 2, -bHeight, bWidth, bHeight - this.char1Y);
                    ctx.restore();
                    if(this.chatY0 < 50) {
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.preMatchConvRight0].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.preMatchConvRight0].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.preMatchConvRight0].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.preMatchConvRight0].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height / 2 - bHeight / 2 - 110 + this.chatY0 + tempMidOffset, bWidth, bHeight);
                        addText(2, 25, 587, "center", canvas.width / 2, canvas.height / 2 - bHeight / 2 - 110 + 29 + this.chatY0 + tempMidOffset, tempEndChat, "#000000");
                    }
                    break;
                case "tournamentWin":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height / 2 - 210 + this.tweenY0 * 1, canvas.width, bHeight);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.blueBarBg].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height / 2 + 210 - bHeight + this.tweenY0 * 3, canvas.width, bHeight);
                    var tempMidOffset = 0;
                    var tempBg = "winBarsBg";
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempBg]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempBg]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempBg]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempBg]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height / 2 - bHeight / 2 + this.tweenY0 * 2 + tempMidOffset, canvas.width, bHeight);
                    if(this.flareScale > 0) {
                        this.flare(canvas.width / 2, canvas.height / 2, 4 * this.flareScale, 2 * this.flareScale, 0);
                    }
                    this.char0Y = -Math.abs(Math.sin(this.incY / 2) * 10) + 10;
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + curChar]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + curChar]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + curChar]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["zoomChar" + curChar]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight - this.char0Y, canvas.width / 2 - bWidth / 2 + this.char0X + this.aZoomCharOffsetx[curChar] - 120, canvas.height / 2 - bHeight + 95 + tempMidOffset + this.char0Y, bWidth, bHeight - this.char0Y);
                    ctx.save();
                    ctx.translate(canvas.width / 2 - this.char0X + 120, canvas.height / 2 + Math.sin(this.incY / 1.5) * 4);
                    ctx.rotate(Math.sin(this.incY * .5) * 0.1);
                    var tempCupId = 0;
                    if(tournamentSize == 13) {
                        tempCupId = 1;
                    }
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["winCup" + tempCupId]].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["winCup" + tempCupId]].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["winCup" + tempCupId]].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["winCup" + tempCupId]].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight / 2, bWidth, bHeight);
                    ctx.restore();
                    var tempChat = 0;
                    var tempSide = "preMatchConvLeft";
                    var tempHeight = -140;
                    var tempTOffset = 29;
                    var tempMidOffset = 0;
                    if(this.chatY0 < 50) {
                        var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempSide + tempChat]].x;
                        var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempSide + tempChat]].y;
                        var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempSide + tempChat]].width;
                        var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds[tempSide + tempChat]].height;
                        ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height / 2 - bHeight / 2 + tempHeight + this.chatY0 + tempMidOffset, bWidth, bHeight);
                        var tempId = curChar;
                        if(charLineUp == 0 && curChar == 6) {
                            tempId = 14;
                        }
                        addText(2, 25, 587, "center", canvas.width / 2, canvas.height / 2 - bHeight / 2 + tempHeight + tempTOffset + this.chatY0 + tempMidOffset, "cupWin" + tempId, "#000000");
                    }
                    var tempCup = 0;
                    if(tournamentSize == 13) {
                        tempCup = 1;
                    }
                    addText(1, 36, 600, "center", canvas.width / 2 - this.headerX, canvas.height / 2 + 200 + this.tweenY0 * 3, "tournamentWinner" + tempCup, "#FFFFFF");
                    break;
                case "pause":
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBarsBg].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBarsBg].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBarsBg].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.titleBarsBg].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, 0, canvas.height / 2 - bHeight / 2 + this.tweenY0 / 2, canvas.width, bHeight);
                    var tempImgData = assetLib.getData("titleLogo");
                    ctx.drawImage(tempImgData.img, 0, 0, tempImgData.img.width, tempImgData.img.height, canvas.width / 2 - (tempImgData.img.width / 2), canvas.height / 2 - (tempImgData.img.height / 2) + this.tweenY0, tempImgData.img.width, tempImgData.img.height);
                    if(this.tweenY0 == 0) {
                        var tempImgData = assetLib.getData("titleLogoWhite");
                        this.flashInc += 1000 * delta;
                        var tempCropWidth = 50;
                        var tempCropPos = Math.min((this.flashInc) % 2000, tempImgData.img.width - tempCropWidth);
                        ctx.drawImage(tempImgData.img, tempCropPos, 0, tempCropWidth, tempImgData.img.height, canvas.width / 2 - tempImgData.img.width / 2 + tempCropPos, canvas.height / 2 - (tempImgData.img.height / 2) + this.tweenY0, tempCropWidth, tempImgData.img.height);
                    }
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cnLogo].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cnLogo].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cnLogo].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.cnLogo].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - bWidth / 2, canvas.height / 2 - 230 + this.tweenY0, bWidth, bHeight);
                    addText(0, 25, 175, "center", canvas.width / 2 - 120, canvas.height / 2 + 225 + this.tweenY0, "continue", "#FFFFFF");
                    addText(0, 25, 175, "center", canvas.width / 2, canvas.height / 2 + 225 + this.tweenY0, "restart", "#FFFFFF");
                    addText(0, 25, 175, "center", canvas.width / 2 + 120, canvas.height / 2 + 225 + this.tweenY0, "quit", "#FFFFFF");
                    break;
                case "rotated":
                    var oRotateIconImgData = assetLib.getData("rotateIcon");
                    ctx.fillStyle = "rgba(0, 0, 0, 1)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(oRotateIconImgData.img, canvas.width / 2 - oRotateIconImgData.img.width / 2, canvas.height / 2 - oRotateIconImgData.img.height / 2);
                    break;
            }
            if(_butsOnTop) {
                this.addButs(ctx);
            }
        };
        Panel.prototype.getStartChatName = function () {
            var tempCurChar = curChar;
            var tempOpChar = opChar;
            if(charLineUp == 0 && tempCurChar == 6) {
                tempCurChar = 14;
            }
            if(charLineUp == 0 && tempOpChar == 6) {
                tempOpChar = 14;
            }
            if(tempCurChar < tempOpChar) {
                this.chatFlip = false;
                return "startChat" + tempCurChar.toString() + "-" + tempOpChar.toString();
            } else {
                this.chatFlip = true;
                return "startChat" + tempOpChar.toString() + "-" + tempCurChar.toString();
            }
        };
        Panel.prototype.flare = function (_x, _y, _scaleX, _scaleY, _col) {
            this.flareRot += delta / 2;
            ctx.save();
            ctx.translate(_x, _y);
            ctx.scale(_scaleX, _scaleY);
            ctx.rotate(this.flareRot);
            var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds["flare" + _col]].x;
            var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds["flare" + _col]].y;
            var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds["flare" + _col]].width;
            var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds["flare" + _col]].height;
            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight / 2, bWidth, bHeight);
            ctx.rotate(-this.flareRot * 2);
            ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight / 2, bWidth, bHeight);
            ctx.restore();
        };
        Panel.prototype.removeBut = function (_id) {
            for(var i = 0; i < this.aButs.length; i++) {
                if(this.aButs[i].id == _id) {
                    this.aButs.splice(i, 1);
                    i -= 1;
                }
            }
        };
        Panel.prototype.addButs = function (ctx) {
            var aButOver = false;
            for(var i = 0; i < this.aButs.length; i++) {
                if(gameState == "charSelect" && curChar != 99 && (oImageIds["charBut" + curChar] == this.aButs[i].id || oImageIds["charBut" + opChar] == this.aButs[i].id)) {
                    continue;
                }
                if(this.aButs[i].isOver) {
                    aButOver = true;
                    break;
                }
            }
            for(var i = 0; i < this.aButs.length; i++) {
                if(gameState == "charSelect" && curChar != 99 && (oImageIds["charBut" + curChar] == this.aButs[i].id || oImageIds["charBut" + opChar] == this.aButs[i].id)) {
                    var aX = (canvas.width * this.aButs[i].align[0]);
                    var aY = (canvas.height * this.aButs[i].align[1]);
                    if(aY + this.aButs[i].aPos[1] > canvas.height / 2) {
                        offsetPosY = this.butsY;
                    } else {
                        offsetPosY = -this.butsY;
                    }
                    bX = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].x;
                    bY = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].y;
                    bWidth = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].width;
                    bHeight = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].height;
                    this.aButs[i].aOverData = new Array(aX + this.aButs[i].aPos[0] - (bWidth / 2) * (this.aButs[i].scale), aY + this.aButs[i].aPos[1] - (bHeight / 2) * (this.aButs[i].scale) + offsetPosY, aX + this.aButs[i].aPos[0] + (bWidth / 2) * (this.aButs[i].scale), aY + this.aButs[i].aPos[1] + (bHeight / 2) * (this.aButs[i].scale) + offsetPosY);
                    ctx.save();
                    ctx.globalAlpha = .25;
                    ctx.drawImage(this.aButs[i].oImgData.img, bX, bY, bWidth, bHeight, this.aButs[i].aOverData[0], this.aButs[i].aOverData[1], bWidth * (this.aButs[i].scale), bHeight * (this.aButs[i].scale));
                    ctx.restore();
                    continue;
                }
                var offsetPosY;
                var floatY = 0;
                if(this.incY != 0 && this.aButs[i].flash) {
                    if(this.aButs[i].isOver) {
                        floatY = Math.sin((this.incY + i * 2.5) * 2) * 3;
                    } else {
                        floatY = Math.sin(this.incY + i * 2.5) * 3;
                    }
                }
                if(i % 2 == 0) {
                }
                if(!this.aButs[i].scale) {
                    this.aButs[i].scale = 1;
                }
                var bX;
                var bY;
                var bWidth;
                var bHeight;
                bX = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].x;
                bY = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].y;
                bWidth = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].width;
                bHeight = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].height;
                var aX = (canvas.width * this.aButs[i].align[0]);
                var aY = (canvas.height * this.aButs[i].align[1]);
                if(aY + this.aButs[i].aPos[1] > canvas.height / 2) {
                    offsetPosY = this.butsY;
                } else {
                    offsetPosY = -this.butsY;
                }
                this.aButs[i].aOverData = new Array(aX + this.aButs[i].aPos[0] - (bWidth / 2) * (this.aButs[i].scale) - floatY / 2, aY + this.aButs[i].aPos[1] - (bHeight / 2) * (this.aButs[i].scale) + offsetPosY + floatY / 2, aX + this.aButs[i].aPos[0] + (bWidth / 2) * (this.aButs[i].scale) - floatY / 2, aY + this.aButs[i].aPos[1] + (bHeight / 2) * (this.aButs[i].scale) + offsetPosY + floatY / 2);
                if(this.aButs[i].isOver && this.aButs[i].flash) {
                    ctx.save();
                    ctx.translate(aX + this.aButs[i].aPos[0], aY + this.aButs[i].aPos[1]);
                    ctx.scale(1 + floatY / 30, 1 + floatY / 30);
                    ctx.globalAlpha = 1;
                    ctx.rotate(this.incY / 7);
                    var bX = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flare0].x;
                    var bY = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flare0].y;
                    var bWidth = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flare0].width;
                    var bHeight = this.oUiElementsImgData.oData.oAtlasData[oImageIds.flare0].height;
                    ctx.drawImage(this.oUiElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight / 2, bWidth, bHeight);
                    ctx.restore();
                }
                ctx.drawImage(this.aButs[i].oImgData.img, bX, bY, bWidth, bHeight, this.aButs[i].aOverData[0], this.aButs[i].aOverData[1], bWidth * (this.aButs[i].scale) + floatY, bHeight * (this.aButs[i].scale) - floatY);
                if(this.aButs[i].isOver || this.aButs[i].flash) {
                    ctx.save();
                    if(this.aButs[i].isOver) {
                        ctx.globalAlpha = 1;
                    } else {
                        if(aButOver) {
                            ctx.globalAlpha = Math.max(Math.sin(this.incY / 2), 0) / 2;
                        } else {
                            ctx.globalAlpha = Math.max(Math.sin(this.incY / 2), 0);
                        }
                    }
                    bX = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].idOver].x;
                    bY = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].idOver].y;
                    bWidth = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].idOver].width;
                    bHeight = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].idOver].height;
                    ctx.drawImage(this.aButs[i].oImgData.img, bX, bY, bWidth, bHeight, this.aButs[i].aOverData[0], this.aButs[i].aOverData[1], bWidth * (this.aButs[i].scale) + floatY, bHeight * (this.aButs[i].scale) - floatY);
                    ctx.restore();
                }
            }
        };
        return Panel;
    })();
    Elements.Panel = Panel;    
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var UserBat = (function () {
        function UserBat() {
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.scale = 1;
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.targX = canvas.width / 2;
            this.targY = canvas.height - 150;
        }
        UserBat.prototype.update = function () {
            this.maxY = canvas.height / 4 + ((this.oGameElementsImgData.oData.oAtlasData[oImageIds.table0].height / tableTop.segs) * (.28 * tableTop.segs)) * (1 + tableTop.offsetY / 3) + tableTop.offsetY * 50;
            this.prevX = this.x;
            this.prevY = this.y;
            this.x = this.targX;
            this.y = Math.max(this.targY, this.maxY);
            this.rotation = Math.max(Math.min((this.x - canvas.width / 2) / 200, 90 * radian), -90 * radian);
            this.scale = (.47 + (this.y - this.maxY) / 500);
        };
        UserBat.prototype.getHitData = function (_tablePosX, _tablePosY) {
            _tablePosX = Math.min(Math.max(_tablePosX, -1), 1);
            var tempX = Math.max(Math.min((this.x - this.prevX) / delta, 3500), -3500) / 3500;
            var tempY = Math.max(Math.min((this.prevY - this.y) / delta, 4500) / 4500, 0);
            var tempSpin = 0;
            if(tempY < .5) {
                if(tempX > .5) {
                    tempSpin = -((tempX - .5) * 2) * (1 - (tempY * 2));
                } else if(tempX < -.5) {
                    tempSpin = -((tempX + .5) * 2) * (1 - (tempY * 2));
                }
            }
            if(_tablePosX < 0) {
                if(tempX > 0) {
                    tempX *= (1 - _tablePosX / 1);
                } else {
                    tempX *= 1.2;
                }
            } else {
                if(tempX < 0) {
                    tempX *= (1 + _tablePosX / 1);
                } else {
                    tempX *= 1.2;
                }
            }
            if(ball.servingState == 0) {
                tempX *= .5;
            }
            this.hitX = tempX + _tablePosX * .8;
            this.hitY = (1 - tempY) * .4;
            return {
                x: this.hitX,
                y: this.hitY,
                speed: .3 + (.3 / .4) * (.4 - this.hitY),
                spin: tempSpin
            };
        };
        UserBat.prototype.render = function () {
            ctx.save();
            ctx.translate(this.x, this.y - 20 * this.scale);
            ctx.scale(this.scale, this.scale * Math.min(1 - ((this.y - canvas.height * .5) / (canvas.height * .5)) * .3, 1));
            ctx.rotate(this.rotation);
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + curChar]].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + curChar]].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + curChar]].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["bat" + curChar]].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight / 3, bWidth, bHeight);
            ctx.restore();
        };
        return UserBat;
    })();
    Elements.UserBat = UserBat;    
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var EnemyBat = (function () {
        function EnemyBat() {
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.scale = 1;
            this.speedX = 3000;
            this.maxAcc = 500;
            this.skillLevel = 0;
            this.speedLevel = 0;
            this.spinLevel = 0;
            this.id = 0;
            this.aEases = new Array("Quad.easeInOut", "Back.easeOut", "Cubic.easeOut", "Back.easeInOut");
            this.trackBall = false;
            this.slideInc = 0;
            this.flailInc = 0;
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.x = canvas.width / 2;
            this.targX = 0;
            this.targY = 0;
            this.accX = 0;
            this.id = (oGameData.cupId * 6 + oGameData.gameId) % 7;
            this.skillLevel = aOpStats[opChar][0];
            this.speedLevel = aOpStats[opChar][1] * .9;
            this.spinLevel = aOpStats[opChar][2];
        }
        EnemyBat.prototype.resetToCentre = function () {
            this.trackBall = false;
            if(this.moveTween) {
                this.moveTween.kill();
            }
            this.targX = this.x - canvas.width / 2;
            this.moveTween = TweenLite.to(this, 1, {
                targX: 0,
                targY: 0,
                ease: "Quad.easeInOut",
                onComplete: function () {
                    if(ball.lastHit == "enemy") {
                        ball.enemyServe();
                    }
                }
            });
        };
        EnemyBat.prototype.flail = function () {
            var _this = this;
            this.flailInc = 0;
            var flailTarg = 1;
            if(ball.x < this.x) {
                flailTarg = -1;
            }
            TweenLite.to(this, .5, {
                flailInc: flailTarg,
                ease: "Quad.easeInOut",
                onComplete: function () {
                    TweenLite.to(_this, .5, {
                        flailInc: 0,
                        ease: "Quad.easeInOut"
                    });
                }
            });
        };
        EnemyBat.prototype.setBouncePos = function (_targBounceX, _targBounceY, _spin) {
            var _this = this;
            if(this.moveTween) {
                this.moveTween.kill();
            }
            var tableImgHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.table0].height;
            if((_spin == 0 || Math.random() * 1 < .25) && ball.servingState != 1) {
                this.trackBall = false;
                var badAim = 0;
                if(Math.random() * 1 > .75 + this.skillLevel * .20) {
                    badAim = Math.random() * 100 - 50;
                }
                var tempY = (((_targBounceY * _targBounceY) * 235) * (1 + tableTop.offsetY / 2)) / 2;
                var tempX = ((tempY) * (tableTop.offsetX + _targBounceX * .6)) * 1.28 * (1 + tableTop.offsetY / 2) + (_targBounceX * 233) / 2 + _spin * 100;
                this.moveTween = TweenLite.to(this, (Math.random() * .35 + .3) * (1 + (1 - this.skillLevel) * .75), {
                    delay: (Math.random() * .2),
                    targX: tempX + badAim,
                    targY: tempY,
                    ease: this.aEases[Math.floor(Math.random() * this.aEases.length)],
                    onComplete: function () {
                        if(ball.lastHit == "enemy") {
                            _this.moveTween = TweenLite.to(_this, (Math.random() * .35 + .3) * (1 + (1 - _this.skillLevel) * .5), {
                                delay: (Math.random() * .3) * (1 + (1 - _this.skillLevel) * .5),
                                targX: Math.random() * 200 - 100,
                                targY: 0,
                                ease: "Quad.easeInOut"
                            });
                        }
                    }
                });
            } else {
                this.trackBall = true;
                this.slideInc = 0;
                this.moveTween = TweenLite.to(this, (Math.random() * .35 + .3) * (1 + (1 - this.skillLevel) * .5), {
                    targY: 0,
                    ease: "Quad.easeInOut"
                });
            }
        };
        EnemyBat.prototype.update = function () {
            this.y = this.targY + canvas.height / 4 + tableTop.offsetY * 50 - 45;
            if(!this.trackBall) {
                this.x = this.targX + canvas.width / 2;
            } else {
                if(this.x > ball.x + 15) {
                    this.slideInc = Math.max(this.slideInc - 1000 * delta, -50 + (-50 * this.skillLevel));
                } else if(this.x < ball.x - 15) {
                    this.slideInc = Math.min(this.slideInc + 1000 * delta, 50 + (50 * this.skillLevel));
                }
                this.x += (this.slideInc * 4) * delta;
                if(ball.lastHit == "enemy") {
                    this.targX = this.x - canvas.width / 2;
                    this.moveTween = TweenLite.to(this, (Math.random() * .35 + .3) * (1 + (1 - this.skillLevel) * .5), {
                        delay: (Math.random() * .3) * (1 + (1 - this.skillLevel) * .5),
                        targX: Math.random() * 200 - 100,
                        targY: 0,
                        ease: "Quad.easeInOut"
                    });
                    this.trackBall = false;
                }
            }
            this.rotation = (this.x - canvas.width / 2) / 200;
            this.scale = .4 + (this.y - canvas.height / 4) / 300;
            this.x = Math.min(Math.max(this.x, canvas.width / 2 - 250), canvas.width / 2 + 250);
        };
        EnemyBat.prototype.getHitData = function (_tablePosX, _tablePosY) {
            if(ball.servingState == 0) {
                this.hitX = (Math.random() * 2 - 1);
                this.hitY = Math.random() * .2 + .65;
            } else {
                this.hitX = (Math.random() * 2 - 1) * (1 + (1 - this.speedLevel) * .25);
                this.hitY = Math.random() * .4 + .65;
            }
            var tempSpin = 0;
            if(this.hitY < .95) {
                if(this.hitX > .1) {
                    tempSpin = -(Math.random() * .5 + .5) * this.spinLevel;
                } else if(this.hitX < -.1) {
                    tempSpin = (Math.random() * .5 + .5) * this.spinLevel;
                }
            }
            var tempSpeed = .3 + ((.3 / .4) * (this.hitY - .6)) * (.25 + this.speedLevel * .75);
            return {
                x: this.hitX,
                y: this.hitY,
                speed: tempSpeed,
                spin: tempSpin
            };
        };
        EnemyBat.prototype.render = function () {
            ctx.save();
            ctx.translate(this.x + (tableTop.offsetX + .8 * this.flailInc) * tableTop.sideMultiplier, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(this.scale * 2, this.scale * 2);
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["opBat" + opChar]].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["opBat" + opChar]].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["opBat" + opChar]].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["opBat" + opChar]].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, -bWidth / 2, -bHeight / 3, bWidth, bHeight);
            ctx.restore();
        };
        return EnemyBat;
    })();
    Elements.EnemyBat = EnemyBat;    
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var Ball = (function () {
        function Ball() {
            this.x = 0;
            this.y = 0;
            this.height = 0;
            this.tablePosY = .5;
            this.tablePosX = 0;
            this.scale = 0;
            this.lastHit = "user";
            this.speed = .45;
            this.offTable = false;
            this.pause = false;
            this.spin = 0;
            this.spinInc = 0;
            this.servingState = 0;
            this.canHit = false;
            this.serveFlip = true;
            this.offSide = false;
            this.bounceX = 0;
            this.bounceY = 0;
            this.ballShortState = 0;
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.resetServe("user");
        }
        Ball.prototype.resetServe = function (_toServe) {
            var _this = this;
            this.servingState = 0;
            this.canHit = false;
            enemyBat.resetToCentre();
            tableTop.tweenToPos(0, 1, this.speed, this.lastHit, this.spin);
            this.lastHit = _toServe;
            rallyHits = 0;
            this.x = -100;
            this.bounceNum = 0;
            this.ballShortState = 0;
            this.offTable = false;
            this.offSide = false;
            if(this.lastHit == "user") {
                this.tablePosX = 0;
                this.tablePosY = .9;
                this.height = 25;
                this.heightInc = 0;
                this.aTrailPoints = new Array();
                this.tableVX = 0;
                this.tableVY = 0;
            } else {
                this.tablePosX = 0;
                this.tablePosY = .2;
                this.height = 15;
                this.heightInc = 0;
                this.aTrailPoints = new Array();
            }
            this.servePosInc = 0;
            this.servePrepTween = TweenLite.to(this, .5, {
                servePosInc: 1,
                ease: "Quad.easeOut",
                onComplete: function () {
                    _this.canHit = true;
                }
            });
        };
        Ball.prototype.enemyServe = function () {
            this.setBouncePoint(enemyBat.getHitData(this.tablePosX, this.tablePosY));
        };
        Ball.prototype.setBouncePoint = function (_oTargBouncePoints) {
            this.spin = _oTargBouncePoints.spin;
            this.spinInc = 0;
            if(this.lastHit == "enemy") {
                this.targBounceX = _oTargBouncePoints.x;
                this.targBounceY = _oTargBouncePoints.y;
                this.speed = _oTargBouncePoints.speed;
                tableTop.tweenToPos(this.targBounceX, this.targBounceY, this.speed, this.lastHit, this.spin);
                if(this.servingState == 0) {
                    this.servingState = 1;
                    this.heightInc = -(-2400 + this.height * 6) * (.8 - this.speed) * 1.2;
                    this.speed = (this.speed - .3) / 4 + .3;
                } else {
                    this.heightInc = (-2400 + this.height * 6) * (.8 - this.speed);
                }
            } else {
                this.targBounceX = _oTargBouncePoints.x;
                this.targBounceY = _oTargBouncePoints.y;
                this.speed = _oTargBouncePoints.speed;
                if(this.servingState == 0) {
                    this.servingState = 1;
                    this.heightInc = -(-2400 + this.height * 6) * (.8 - this.speed) * 1.2;
                    this.speed = (this.speed - .3) / 6 + .3;
                } else {
                    this.heightInc = (-2400 + this.height * 6) * (.8 - this.speed);
                }
                tableTop.tweenToPos(0, 1, this.speed, this.lastHit, this.spin);
                enemyBat.setBouncePos(this.targBounceX, this.targBounceY, this.spin);
            }
            this.tableVX = (this.targBounceX - this.tablePosX) / ((1 - this.speed) * 1.1);
            this.tableVY = (this.targBounceY - this.tablePosY) / ((1 - this.speed) * 1.1);
        };
        Ball.prototype.update = function () {
            if(this.servingState == 0) {
                if(this.lastHit == "user") {
                    this.y = (canvas.height / 4) + tableTop.offsetY * 50 + ((this.tablePosY * this.tablePosY) * 235) * (1 + tableTop.offsetY / 2) + (1 - this.servePosInc) * 100;
                    this.tablePosX = Math.min(Math.max((userBat.x - canvas.width / 2) / 300, -.95), .95);
                    this.x = canvas.width / 2 + (((this.y - (canvas.height / 4)) * (tableTop.offsetX + this.tablePosX * .6)) * 1.28 * (1 + tableTop.offsetY / 2) + (this.tablePosX * 233) / 2 + tableTop.offsetX * tableTop.sideMultiplier) + (1 - this.servePosInc) * -500;
                    this.scale = .27 + (this.y - (canvas.height / 4)) / 600;
                    if(this.canHit && userBat.getHitData(this.tablePosX, this.tablePosY).y < .4) {
                        if(userBat.x > this.x - 80 * userBat.scale && userBat.x < this.x + 80 * userBat.scale && userBat.y > this.y - this.height * (this.scale * 3) - 16 - 80 * userBat.scale && userBat.y < this.y - this.height * (this.scale * 3) - 16 + 80 * userBat.scale) {
                            this.bounceNum = 0;
                            this.lastHit = "user";
                            this.setBouncePoint(userBat.getHitData(this.tablePosX, this.tablePosY));
                        }
                    }
                } else {
                    this.y = (canvas.height / 4) + tableTop.offsetY * 50 + ((this.tablePosY * this.tablePosY) * 235) * (1 + tableTop.offsetY / 2) + (1 - this.servePosInc) * 100;
                    this.tablePosX = 0;
                    this.x = canvas.width / 2 + (((this.y - (canvas.height / 4)) * (tableTop.offsetX + this.tablePosX * .6)) * 1.28 * (1 + tableTop.offsetY / 2) + (this.tablePosX * 233) / 2 + tableTop.offsetX * tableTop.sideMultiplier) + (1 - this.servePosInc) * -500;
                    this.scale = .27 + (this.y - (canvas.height / 4)) / 600;
                }
            } else {
                if(!this.offTable) {
                    if(this.lastHit == "user") {
                        this.spinInc = Math.min(Math.max(this.spinInc + (Math.pow(this.spin * 2.5, 3) * delta) * (1 - this.tablePosY), -3), 3);
                    } else {
                        this.spinInc = Math.min(Math.max(this.spinInc + (Math.pow(this.spin * 2, 3) * delta) * this.tablePosY, -2), 2);
                    }
                    this.tablePosX += (this.tableVX + this.spinInc) * delta;
                    this.tablePosY += this.tableVY * delta;
                }
                if(!this.offTable && this.lastHit == "user" && this.tablePosY < 0) {
                    this.offTable = true;
                    this.offTableVX = (this.x - this.aTrailPoints[0].x) * 10;
                    this.offTableVY = (this.y - this.aTrailPoints[0].y) * 10;
                    if(this.offTableTween) {
                        this.offTableTween.kill();
                    }
                    this.offTableTween = TweenLite.to(this, 2, {
                        offTableVX: 0,
                        offTableVY: 0,
                        ease: "Quad.easeOut"
                    });
                    enemyBat.flail();
                }
                this.heightInc += 3800 * delta;
                this.height -= (this.heightInc * this.speed) * delta;
                if(this.ballShortState == 1 && this.tablePosY <= .5) {
                    playSound("hitNet");
                    this.tableVY *= -.5;
                    this.tableVX *= .5;
                    this.ballShortState = 2;
                    this.heightInc *= .2;
                }
                if(this.tablePosX > -1 && this.tablePosX < 1 && this.tablePosY > 0 && this.tablePosY < 1 && this.height <= 0 && !this.offSide) {
                    this.height = 0;
                    this.heightInc *= -.85;
                    if(this.ballShortState == 0) {
                        var n = Math.floor(Math.random() * 6);
                        playSound("bounce" + n);
                    } else {
                        this.height = -3;
                    }
                    this.bounceNum++;
                    this.bounceX = this.tablePosX;
                    this.bounceY = this.tablePosY;
                    tableTop.bounce();
                    if(this.lastHit == "user" && this.tablePosY > .5 && this.servingState > 1) {
                        this.spin = 0;
                        this.ballShortState = 1;
                    }
                } else if((this.tablePosX < -1 || this.tablePosX > 1) && !this.offTable && this.tablePosY < 1 && this.height <= 0) {
                    this.offSide = true;
                }
                if((this.offTable || this.offSide) && this.height <= -200) {
                    if(this.lastHit == "user") {
                        if(this.bounceNum == 0) {
                            updateScore("enemy");
                        } else {
                            updateScore("user");
                        }
                    } else {
                        if(this.bounceNum == 0) {
                            updateScore("user");
                        } else {
                            updateScore("enemy");
                        }
                    }
                    if((oGameData.userScore + oGameData.enemyScore) % 2 == 0 || (oGameData.userScore >= 10 && oGameData.enemyScore >= 10)) {
                        this.serveFlip = !this.serveFlip;
                    }
                    if(!this.serveFlip) {
                        this.resetServe("enemy");
                    } else {
                        this.resetServe("user");
                    }
                    return;
                }
                var tableImgHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.table0].height;
                if(!this.offTable) {
                    this.y = (canvas.height / 4) + tableTop.offsetY * 50 + ((this.tablePosY * this.tablePosY) * 235) * (1 + tableTop.offsetY / 2);
                    this.x = canvas.width / 2 + ((this.y - (canvas.height / 4)) * (tableTop.offsetX + this.tablePosX * .6)) * 1.28 * (1 + tableTop.offsetY / 2) + (this.tablePosX * 233) / 2 + tableTop.offsetX * tableTop.sideMultiplier;
                } else {
                    this.x += this.offTableVX * delta;
                    this.y += this.offTableVY * delta;
                }
                this.scale = .27 + (this.y - (canvas.height / 4)) / 600;
                this.aTrailPoints.push({
                    x: this.x,
                    y: this.y,
                    height: this.height,
                    scale: this.scale
                });
                if(this.aTrailPoints.length > 5) {
                    this.aTrailPoints.shift();
                }
                if(this.y > canvas.height) {
                    if(this.bounceNum > 0 || this.ballShortState > 0) {
                        updateScore("enemy");
                    } else {
                        updateScore("user");
                    }
                    if((oGameData.userScore + oGameData.enemyScore) % 2 == 0) {
                        this.serveFlip = !this.serveFlip;
                    }
                    if(!this.serveFlip) {
                        this.resetServe("enemy");
                    } else {
                        this.resetServe("user");
                    }
                    return;
                }
                if(this.lastHit == "enemy" && ((this.servingState == 2 && this.bounceNum == 1) || (this.servingState == 1 && this.bounceNum == 2)) && !(this.height < 0 && this.bounceNum == 0) && this.tablePosY > .5 && userBat.x > this.x - 82 * userBat.scale && userBat.x < this.x + 82 * userBat.scale && userBat.y > this.y - this.height * (this.scale * 3) - 16 - 82 * userBat.scale && userBat.y < this.y - this.height * (this.scale * 3) - 16 + 82 * userBat.scale) {
                    playSound("hit" + Math.floor(Math.random() * 6));
                    rallyHits++;
                    this.servingState = 2;
                    this.bounceNum = 0;
                    this.lastHit = "user";
                    this.setBouncePoint(userBat.getHitData(this.tablePosX, this.tablePosY));
                }
                if(this.lastHit == "user" && ((this.servingState == 2 && this.bounceNum == 1) || (this.servingState == 1 && this.bounceNum == 2)) && this.tablePosY < .5 && this.tablePosY > 0 && enemyBat.x > this.x - 70 * enemyBat.scale && enemyBat.x < this.x + 70 * enemyBat.scale && enemyBat.y > this.y - this.height * (this.scale * 3) - 16 - 70 * enemyBat.scale && enemyBat.y < this.y - this.height * (this.scale * 3) - 16 + 70 * enemyBat.scale) {
                    playSound("hit" + Math.floor(Math.random() * 6));
                    rallyHits++;
                    this.servingState = 2;
                    this.bounceNum = 0;
                    this.lastHit = "enemy";
                    this.setBouncePoint(enemyBat.getHitData(this.tablePosX, this.tablePosY));
                }
            }
        };
        Ball.prototype.render = function () {
            if(this.tablePosX > -1 && this.tablePosX < 1 && this.tablePosY > 0 && this.tablePosY < 1) {
                var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ballShadow].x;
                var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ballShadow].y;
                var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ballShadow].width;
                var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ballShadow].height;
                ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.x - (bWidth / 2) * this.scale, this.y - (bHeight / 2) * this.scale, bWidth * this.scale, bHeight * this.scale);
            } else {
            }
            if(this.lastHit == "enemy" && this.ballShortState == 0) {
                this.renderTrail();
            }
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ball].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ball].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ball].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.ball].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.x - (bWidth / 2) * this.scale, this.y - (bHeight / 2) * this.scale - this.height * (this.scale * 3) - 16, bWidth * this.scale, bHeight * this.scale);
            if(this.lastHit == "user" && this.ballShortState == 0) {
                this.renderTrail();
            }
        };
        Ball.prototype.renderTrail = function () {
            var tempTrailNum = Math.floor((this.aTrailPoints.length / .3) * (Math.max(Math.min(this.speed, .6), .3) - .3));
            for(var i = 0; i < tempTrailNum; i++) {
                var temp = ((this.aTrailPoints.length - tempTrailNum) + i);
                if(temp < 0 || temp > this.aTrailPoints.length - 1) {
                    console.log(temp, tempTrailNum, this.speed);
                }
                var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds["ballTrail" + temp]].x;
                var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds["ballTrail" + temp]].y;
                var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds["ballTrail" + temp]].width;
                var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds["ballTrail" + temp]].height;
                ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, this.aTrailPoints[temp].x - (bWidth / 2) * this.aTrailPoints[temp].scale, this.aTrailPoints[temp].y - (bHeight / 2) * this.aTrailPoints[temp].scale - this.aTrailPoints[temp].height * (this.aTrailPoints[temp].scale * 3) - 16, bWidth * this.aTrailPoints[temp].scale, bHeight * this.aTrailPoints[temp].scale);
            }
        };
        return Ball;
    })();
    Elements.Ball = Ball;    
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var TableTop = (function () {
        function TableTop() {
            this.segs = 75;
            this.offsetX = 0;
            this.offsetY = 0;
            this.netY = 0;
            this.segMultiplier = 1;
            this.netHeight = 0;
            this.id = 0;
            this.sideMultiplier = 100;
            this.bounceMarkScale = 0;
            this.oGameElementsImgData = assetLib.getData("gameElements");
            this.oGameThemesImgData = assetLib.getData("gameThemes");
            this.oShadowImgData = assetLib.getData("shadow");
            this.id = alevelThemes[opChar];
            if(!isMobile) {
                this.segs = 150;
                this.segMultiplier = .5;
            }
        }
        TableTop.prototype.bounce = function () {
            this.bounceMarkScale = 1;
            TweenLite.to(this, .3, {
                bounceMarkScale: 0,
                ease: "Quad.easeIn"
            });
        };
        TableTop.prototype.tweenToPos = function (_x, _y, _speed, _hitBy, _spin) {
            if(this.offsetTween) {
                this.offsetTween.kill();
            }
            var tempX = 0;
            var tempY = 0;
            if(_x > .3 || _x < -.3) {
                tempX = -_x / 1.75 - _spin / 2;
            }
            var tempTime = .5;
            if(_hitBy == "enemy") {
                tempTime = .5;
                tempY = (1 - (_y - .5) * 2) * (.3 - (_speed - .3)) / .3;
            }
            this.offsetTween = TweenLite.to(this, tempTime, {
                offsetX: tempX,
                offsetY: tempY,
                ease: "Quad.easeOut"
            });
        };
        TableTop.prototype.render = function () {
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.net].height;
            this.netY = canvas.height / 4 - bHeight + ((this.oGameThemesImgData.oData.oAtlasData[oImageIds.table0].height / this.segs) * (.282 * this.segs)) * (1 + this.offsetY / 3) + this.offsetY * 50;
            this.netHeight = bHeight * (1 + this.offsetY / 3);
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableClip].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableClip].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableClip].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableClip].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * (1 + this.offsetY / 3) + ((this.offsetX * (.282 * this.segs)) * 3) * (1 + this.offsetY / 3) + this.offsetX * this.sideMultiplier * this.segMultiplier, this.netY + this.netHeight - 3 * (1 + this.offsetY / 3), bWidth * (1 + this.offsetY / 3), bHeight * (1 + this.offsetY / 3));
            ctx.drawImage(this.oShadowImgData.img, 0, 0, this.oShadowImgData.img.width, this.oShadowImgData.img.height, canvas.width / 2 - (this.oShadowImgData.img.width / 2) * (1 + this.offsetY / 3) + ((this.offsetX * 100) * 2.3) * (1 + this.offsetY / 3) + this.offsetX * this.sideMultiplier, canvas.height / 4 + (this.oGameThemesImgData.oData.oAtlasData[oImageIds.table0].height) * (1 + this.offsetY / 3.5) + this.offsetY * 50 - 80, this.oShadowImgData.img.width * (1 + this.offsetY / 3), this.oShadowImgData.img.height * (1 + this.offsetY / 3));
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableLegs].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableLegs].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableLegs].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableLegs].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * (1 + this.offsetY / 3) + ((this.offsetX * 100) * 2.3) * (1 + this.offsetY / 3) + this.offsetX * this.sideMultiplier, canvas.height / 4 + (this.oGameThemesImgData.oData.oAtlasData[oImageIds.table0].height) * (1 + this.offsetY / 3.5) + this.offsetY * 50 + 25, bWidth * (1 + this.offsetY / 3), bHeight * (1 + this.offsetY / 3));
            var bX = this.oGameThemesImgData.oData.oAtlasData[oImageIds["table" + this.id]].x;
            var bY = this.oGameThemesImgData.oData.oAtlasData[oImageIds["table" + this.id]].y;
            var bWidth = this.oGameThemesImgData.oData.oAtlasData[oImageIds["table" + this.id]].width;
            var bHeight = this.oGameThemesImgData.oData.oAtlasData[oImageIds["table" + this.id]].height;
            for(var i = 0; i < this.segs; i++) {
                ctx.drawImage(this.oGameThemesImgData.img, bX, bY + (bHeight / this.segs) * i, bWidth, (bHeight / this.segs), canvas.width / 2 - (bWidth / 2) * (1 + this.offsetY / 3) + ((this.offsetX * (i * (100 / this.segs))) * 3) * (1 + this.offsetY / 3) + this.offsetX * this.sideMultiplier, canvas.height / 4 + ((bHeight / this.segs) * i) * (1 + this.offsetY / 2) + this.offsetY * 50, bWidth * (1 + this.offsetY / 3), (bHeight / this.segs) * (1 + this.offsetY / 2));
            }
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableEdge].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableEdge].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableEdge].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.tableEdge].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * (1 + this.offsetY / 3) + ((this.offsetX * 100) * 3) * (1 + this.offsetY / 3) + this.offsetX * this.sideMultiplier, canvas.height / 4 + (this.oGameThemesImgData.oData.oAtlasData[oImageIds.table0].height) * (1 + this.offsetY / 2) + this.offsetY * 50, bWidth * (1 + this.offsetY / 3), bHeight * (1 + this.offsetY / 3));
            if(this.bounceMarkScale > 0) {
                var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.bounceMark].x;
                var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.bounceMark].y;
                var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.bounceMark].width;
                var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.bounceMark].height;
                var tempY = (canvas.height / 4) + this.offsetY * 50 + ((ball.bounceY * ball.bounceY) * 235) * (1 + this.offsetY / 2);
                var tempX = canvas.width / 2 + ((tempY - (canvas.height / 4)) * (this.offsetX + ball.bounceX * .6)) * 1.28 * (1 + this.offsetY / 2) + (ball.bounceX * 233) / 2 + this.offsetX * this.sideMultiplier;
                var tempScale = .27 + (tempY - (canvas.height / 4)) / 600;
                ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, tempX - (bWidth / 2) * (tempScale * this.bounceMarkScale), tempY - (bHeight / 2) * (tempScale * this.bounceMarkScale), bWidth * (tempScale * this.bounceMarkScale), bHeight * (tempScale * this.bounceMarkScale));
            }
        };
        TableTop.prototype.renderNet = function () {
            var bX = this.oGameElementsImgData.oData.oAtlasData[oImageIds.net].x;
            var bY = this.oGameElementsImgData.oData.oAtlasData[oImageIds.net].y;
            var bWidth = this.oGameElementsImgData.oData.oAtlasData[oImageIds.net].width;
            var bHeight = this.oGameElementsImgData.oData.oAtlasData[oImageIds.net].height;
            ctx.drawImage(this.oGameElementsImgData.img, bX, bY, bWidth, bHeight, canvas.width / 2 - (bWidth / 2) * (1 + this.offsetY / 3) + ((this.offsetX * (.282 * this.segs)) * 3) * (1 + this.offsetY / 3) + this.offsetX * this.sideMultiplier * this.segMultiplier, this.netY, bWidth * (1 + this.offsetY / 3), this.netHeight);
        };
        return TableTop;
    })();
    Elements.TableTop = TableTop;    
})(Elements || (Elements = {}));
var Utils;
(function (Utils) {
    var TextDisplay = (function () {
        function TextDisplay() {
            this.oTextData = {
            };
            this.inc = 0;
            this.createTextObjects();
        }
        TextDisplay.prototype.createTextObjects = function () {
            var cnt = 0;
            for(var i in assetLib.textData.langText.text[curLang]) {
                this.oTextData[i] = {
                };
                this.oTextData[i].aLineData = this.getCharData(assetLib.textData.langText.text[curLang][i]["@text"], assetLib.textData.langText.text[curLang][i]["@fontId"]);
                this.oTextData[i].aLineWidths = this.getLineWidths(this.oTextData[i].aLineData);
                this.oTextData[i].blockWidth = this.getBlockWidth(this.oTextData[i].aLineData);
                this.oTextData[i].blockHeight = this.getBlockHeight(this.oTextData[i].aLineData, assetLib.textData.langText.text[curLang][i]["@fontId"]);
                this.oTextData[i].lineHeight = parseInt(assetLib.textData["fontData" + assetLib.textData.langText.text[curLang][i]["@fontId"]].text.common["@lineHeight"]);
                this.oTextData[i].oFontImgData = assetLib.getData("font" + assetLib.textData.langText.text[curLang][i]["@fontId"]);
            }
        };
        TextDisplay.prototype.getLineWidths = function (_aCharData) {
            var lineLength;
            var aLineWidths = new Array();
            for(var i = 0; i < _aCharData.length; i++) {
                lineLength = 0;
                for(var j = 0; j < _aCharData[i].length; j++) {
                    lineLength += parseInt(_aCharData[i][j]["@xadvance"]);
                    if(j == 0) {
                        lineLength -= parseInt(_aCharData[i][j]["@xoffset"]);
                    } else if(j == _aCharData[i].length - 1) {
                        lineLength += parseInt(_aCharData[i][j]["@xoffset"]);
                    }
                }
                aLineWidths.push(lineLength);
            }
            return aLineWidths;
        };
        TextDisplay.prototype.getBlockWidth = function (_aCharData) {
            var lineLength;
            var longestLineLength = 0;
            for(var i = 0; i < _aCharData.length; i++) {
                lineLength = 0;
                for(var j = 0; j < _aCharData[i].length; j++) {
                    lineLength += parseInt(_aCharData[i][j]["@xadvance"]);
                    if(j == 0) {
                        lineLength -= parseInt(_aCharData[i][j]["@xoffset"]);
                    } else if(j == _aCharData[i].length - 1) {
                        lineLength += parseInt(_aCharData[i][j]["@xoffset"]);
                    }
                }
                if(lineLength > longestLineLength) {
                    longestLineLength = lineLength;
                }
            }
            return longestLineLength;
        };
        TextDisplay.prototype.getBlockHeight = function (_aCharData, _fontId) {
            return _aCharData.length * parseInt(assetLib.textData["fontData" + _fontId].text.common["@lineHeight"]);
        };
        TextDisplay.prototype.getCharData = function (_aLines, _fontId) {
            var aCharData = new Array();
            for(var k = 0; k < _aLines.length; k++) {
                aCharData[k] = new Array();
                for(var i = 0; i < _aLines[k].length; i++) {
                    for(var j = 0; j < assetLib.textData["fontData" + _fontId].text.chars.char.length; j++) {
                        if(_aLines[k][i].charCodeAt() == assetLib.textData["fontData" + _fontId].text.chars.char[j]["@id"]) {
                            aCharData[k].push(assetLib.textData["fontData" + _fontId].text.chars.char[j]);
                        }
                    }
                }
            }
            return aCharData;
        };
        TextDisplay.prototype.renderText = function (_oTextDisplayData) {
            var aLinesToRender = this.oTextData[_oTextDisplayData.text].aLineData;
            var oFontImgData = this.oTextData[_oTextDisplayData.text].oFontImgData;
            var shiftX;
            var offsetX = 0;
            var offsetY = 0;
            var lineOffsetY = 0;
            var manualScale = 1;
            var animY = 0;
            if(_oTextDisplayData.lineOffsetY) {
                lineOffsetY = _oTextDisplayData.lineOffsetY;
            }
            if(_oTextDisplayData.scale) {
                manualScale = _oTextDisplayData.scale;
            }
            var textScale = 1 * manualScale;
            if(_oTextDisplayData.maxWidth && this.oTextData[_oTextDisplayData.text].blockWidth * manualScale > _oTextDisplayData.maxWidth) {
                textScale = _oTextDisplayData.maxWidth / this.oTextData[_oTextDisplayData.text].blockWidth;
            }
            if(_oTextDisplayData.anim) {
                this.inc += delta * 7;
            }
            for(var i = 0; i < aLinesToRender.length; i++) {
                shiftX = 0;
                if(_oTextDisplayData.alignX == "centre") {
                    offsetX = this.oTextData[_oTextDisplayData.text].aLineWidths[i] / 2;
                }
                if(_oTextDisplayData.alignY == "centre") {
                    offsetY = this.oTextData[_oTextDisplayData.text].blockHeight / 2 + (lineOffsetY * (aLinesToRender.length - 1)) / 2;
                }
                for(var j = 0; j < aLinesToRender[i].length; j++) {
                    var bX = aLinesToRender[i][j]["@x"];
                    var bY = aLinesToRender[i][j]["@y"];
                    var bWidth = aLinesToRender[i][j]["@width"];
                    var bHeight = aLinesToRender[i][j]["@height"];
                    if(_oTextDisplayData.anim) {
                        animY = Math.sin(this.inc + j / 2) * ((bHeight / 15) * textScale);
                    }
                    ctx.drawImage(oFontImgData.img, bX, bY, bWidth, bHeight, _oTextDisplayData.x + (shiftX + parseInt(aLinesToRender[i][j]["@xoffset"]) - offsetX) * textScale, _oTextDisplayData.y + (parseInt(aLinesToRender[i][j]["@yoffset"]) + (i * this.oTextData[_oTextDisplayData.text].lineHeight) + (i * lineOffsetY) - offsetY) * textScale + animY, bWidth * textScale, bHeight * textScale);
                    shiftX += parseInt(aLinesToRender[i][j]["@xadvance"]);
                }
            }
        };
        return TextDisplay;
    })();
    Utils.TextDisplay = TextDisplay;    
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var CountryFlags = (function () {
        function CountryFlags(_aSelectedCountries, _randomise) {
            if (typeof _randomise === "undefined") { _randomise = false; }
            this.aAllCountryCodes = {
                0: "ES",
                1: "AU",
                2: "AT",
                3: "AG",
                4: "AR",
                5: "AM",
                6: "BO",
                7: "BQ",
                8: "BA",
                9: "TL",
                10: "VN",
                11: "GA",
                12: "PT",
                13: "AZ",
                14: "",
                15: "AW",
                16: "BS",
                17: "BD",
                18: "BW",
                19: "BR",
                20: "BN",
                21: "HW",
                22: "GY",
                23: "GM",
                24: "",
                25: "AL",
                26: "DZ",
                27: "BB",
                28: "BH",
                29: "BY",
                30: "BF",
                31: "BI",
                32: "VU",
                33: "GH",
                34: "GP",
                35: "GN",
                36: "AI",
                37: "AO",
                38: "AD",
                39: "BE",
                40: "BJ",
                41: "BG",
                42: "GB",
                43: "HU",
                44: "VE",
                45: "GN",
                46: "GW",
                47: "DE",
                48: "ZW",
                49: "IL",
                50: "IN",
                51: "KZ",
                52: "CM",
                53: "CA",
                54: "CO",
                55: "KM",
                56: "CD",
                57: "CW",
                58: "LA",
                59: "LV",
                60: "ID",
                61: "JO",
                62: "IQ",
                63: "QA",
                64: "KE",
                65: "CY",
                66: "CG",
                67: "KP",
                68: "KR",
                69: "LS",
                70: "LR",
                71: "LB",
                72: "IR",
                73: "IE",
                74: "IS",
                75: "",
                76: "KG",
                77: "KI",
                78: "",
                79: "CR",
                80: "CI",
                81: "LY",
                82: "LT",
                83: "LI",
                84: "IT",
                85: "",
                86: "",
                87: "CN",
                88: "",
                89: "",
                90: "CU",
                91: "",
                92: "CK",
                93: "",
                94: "",
                95: "",
                96: "",
                97: "",
                98: "",
                99: "",
                100: "",
                101: "",
                102: "",
                103: "",
                104: "",
                105: "NL",
                106: "",
                107: "NZ",
                108: "",
                109: "",
                110: "",
                111: "",
                112: "",
                113: "",
                114: "",
                115: "",
                116: "",
                117: "",
                118: "",
                119: "TR",
                120: "RU",
                121: "",
                122: "",
                123: "",
                124: "",
                125: "",
                126: "",
                127: "",
                128: "",
                129: "UZ",
                130: "",
                131: "UY",
                132: "",
                133: "WS",
                134: "",
                135: "",
                136: "",
                137: "",
                138: "",
                139: "",
                140: "",
                141: "",
                142: "PH",
                143: "FI",
                144: "",
                145: "",
                146: "",
                147: "",
                148: "",
                149: "US",
                150: "",
                151: "",
                152: "",
                153: "FR",
                154: "",
                155: "",
                156: "",
                157: "",
                158: "",
                159: "CZ",
                160: "CL",
                161: "CH",
                162: "MG",
                163: "",
                164: "",
                165: "",
                166: "",
                167: "",
                168: "HK",
                169: "",
                170: "GL",
                171: "SE",
                172: "",
                173: "EE",
                174: "",
                175: "MY",
                176: "",
                177: "",
                178: "NO",
                179: "",
                180: "GR",
                181: "",
                182: "DK",
                183: "ET",
                184: "",
                185: "ZA",
                186: "",
                187: "",
                188: "",
                189: "AE",
                190: "PK",
                191: "",
                192: "",
                193: "",
                194: "",
                195: "",
                196: "JM",
                197: "JP",
                198: "PE",
                199: "",
                200: "PL",
                201: "",
                202: "",
                203: "PG"
            };
            this.aIds = new Array();
            for(var i = 0; i < _aSelectedCountries.length; i++) {
                this.aIds.push(this.getIdFromISO(_aSelectedCountries[i]));
            }
            if(_randomise) {
                this.aIds = this.randomise(this.aIds);
            }
        }
        CountryFlags.prototype.getIdFromISO = function (_ISO) {
            var n = 0;
            for(var i in this.aAllCountryCodes) {
                if(this.aAllCountryCodes[i] == _ISO) {
                    n;
                    break;
                }
                n++;
            }
            return n;
        };
        CountryFlags.prototype.getBData = function (_id) {
            var oBData = {
                bX: (_id % 12) * 124 + 30.5,
                bY: Math.floor(_id / 12) * 85.5 + 14,
                bWidth: 85.5,
                bHeight: 59
            };
            return oBData;
        };
        CountryFlags.prototype.randomise = function (_aTemp) {
            for(var i = _aTemp.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = _aTemp[i];
                _aTemp[i] = _aTemp[j];
                _aTemp[j] = temp;
            }
            return _aTemp;
        };
        return CountryFlags;
    })();
    Utils.CountryFlags = CountryFlags;    
})(Utils || (Utils = {}));
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Elements;
(function (Elements) {
    var Firework = (function (_super) {
        __extends(Firework, _super);
        function Firework() {
                _super.call(this, assetLib.getData("firework"), 30, 30, "explode");
            this.vy = 0;
            this.setAnimType("once", "explode");
            this.animEndedFunc = function () {
                this.removeMe = true;
            };
            TweenLite.to(this, 1, {
                scaleX: 2,
                scaleY: 2,
                ease: "Quad.easeOut"
            });
        }
        Firework.prototype.update = function (_trackX, _trackY) {
            this.vy += 150 * delta;
            this.y += this.vy * delta;
            _super.prototype.updateAnimation.call(this, delta);
        };
        Firework.prototype.render = function () {
            _super.prototype.renderSimple.call(this, ctx);
        };
        return Firework;
    })(Utils.AnimSprite);
    Elements.Firework = Firework;    
})(Elements || (Elements = {}));
var Utils;
(function (Utils) {
    var SaveDataHandler = (function () {
        function SaveDataHandler(_saveDataId) {
            this.dataGroupNum = 2;
            this.saveDataId = _saveDataId;
            var testKey = 'test', storage = window.sessionStorage;
            try  {
                storage.setItem(testKey, '1');
                storage.removeItem(testKey);
                this.canStore = true;
            } catch (error) {
                this.canStore = false;
            }
            this.clearData();
            this.setInitialData();
        }
        SaveDataHandler.prototype.clearData = function () {
            this.aLevelStore = new Array();
            for(var i = 0; i < 14; i++) {
                this.aLevelStore.push(0);
            }
            for(var i = 0; i < 5; i++) {
                this.aLevelStore.push(0);
            }
        };
        SaveDataHandler.prototype.resetData = function () {
            this.clearData();
            this.saveData();
        };
        SaveDataHandler.prototype.setInitialData = function () {
            if(this.canStore && typeof (Storage) !== "undefined") {
                if(localStorage.getItem(this.saveDataId) != null && localStorage.getItem(this.saveDataId) != "") {
                    this.aLevelStore = localStorage.getItem(this.saveDataId).split(",");
                    for(var a in this.aLevelStore) {
                        this.aLevelStore[a] = parseInt(this.aLevelStore[a]);
                    }
                } else {
                    this.saveData();
                }
            }
        };
        SaveDataHandler.prototype.resetSingleChar = function (_char) {
            this.aLevelStore[_char] = 0;
        };
        SaveDataHandler.prototype.setLevelProgress = function (_char, _level) {
            this.aLevelStore[_char] = _level;
            if(this.aLevelStore[_char] > 2) {
                this.aLevelStore[14] = 1;
            }
            if(this.aLevelStore[_char] > 5) {
                this.aLevelStore[15] = 1;
            }
            if(this.aLevelStore[_char] > 8) {
                this.aLevelStore[16] = 1;
            }
            if(this.aLevelStore[_char] > 11) {
                this.aLevelStore[17] = 1;
            }
            if(this.aLevelStore[_char] > 12) {
                this.aLevelStore[18] = 1;
            }
        };
        SaveDataHandler.prototype.getCharInProgress = function () {
            var n = 99;
            for(var i = 0; i < this.aLevelStore.length; i++) {
                if(this.aLevelStore[i] != 0 && this.aLevelStore[i] < 13) {
                    n = i;
                    break;
                }
            }
            return n;
        };
        SaveDataHandler.prototype.getUnlockedCharData = function () {
            return this.aLevelStore.slice(14);
        };
        SaveDataHandler.prototype.getNextLevel = function (_char) {
            return this.aLevelStore[_char];
        };
        SaveDataHandler.prototype.saveData = function () {
            if(this.canStore && typeof (Storage) !== "undefined") {
                var str = "";
                for(var i = 0; i < this.aLevelStore.length; i++) {
                    str += this.aLevelStore[i];
                    if(i < this.aLevelStore.length - 1) {
                        str += ",";
                    }
                }
                localStorage.setItem(this.saveDataId, str);
            }
        };
        return SaveDataHandler;
    })();
    Utils.SaveDataHandler = SaveDataHandler;    
})(Utils || (Utils = {}));
var requestAnimFrame = (function () {
    return window.requestAnimationFrame || (window).webkitRequestAnimationFrame || (window).mozRequestAnimationFrame || (window).oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60, new Date().getTime());
    };
})();
var previousTime;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var maxWidth = 850;
var minWidth = 800;
var maxHeight = 550;
var minHeight = 500;
var canvasX;
var canvasY;
var canvasScale;
var div = document.getElementById('canvas-wrapper');
var sound;
var music;
var audioType = 0;
var muted = false;
var splashTimer = 0;
var assetLib;
var preAssetLib;
var isMobile = false;
var gameState = "loading";
var aLangs = new Array("EN");
var curLang = "";
var isBugBrowser = false;
var isIE10 = false;
var delta;
var radian = Math.PI / 180;
var ios9FirstTouch = false;
var isRotated = false;
var prevGameState;
var saveDataHandler = new Utils.SaveDataHandler("cnttutv3");
var hasFocus = true;
if(navigator.userAgent.match(/MSIE\s([\d]+)/)) {
    isIE10 = true;
}
var deviceAgent = navigator.userAgent.toLowerCase();
if(deviceAgent.match(/(iphone|ipod|ipad)/) || deviceAgent.match(/(android)/) || deviceAgent.match(/(iemobile)/) || deviceAgent.match(/iphone/i) || deviceAgent.match(/ipad/i) || deviceAgent.match(/ipod/i) || deviceAgent.match(/blackberry/i) || deviceAgent.match(/bada/i)) {
    isMobile = true;
    if(deviceAgent.match(/(android)/) && !/Chrome/.test(navigator.userAgent)) {
        isBugBrowser = true;
    }
}
var userInput = new Utils.UserInput(canvas, isBugBrowser);
resizeCanvas();
window.onresize = function () {
    setTimeout(function () {
        resizeCanvas();
    }, 1);
};
function visibleResume() {
    if(!hasFocus) {
        if(userInput) {
            userInput.checkKeyFocus();
        }
        if(!muted && gameState != "pause" && gameState != "splash" && gameState != "loading") {
            Howler.mute(false);
            playMusic();
        }
    }
    hasFocus = true;
}
function visiblePause() {
    hasFocus = false;
    Howler.mute(true);
    music.pause();
}
(window).onpageshow = function () {
    if(!hasFocus) {
        if(userInput) {
            userInput.checkKeyFocus();
        }
        if(!muted && gameState != "pause" && gameState != "splash" && gameState != "loading") {
            Howler.mute(false);
            playMusic();
        }
    }
    hasFocus = true;
};
(window).onpagehide = function () {
    hasFocus = false;
    Howler.mute(true);
    music.pause();
};
function playMusic() {
    if(!music.playing()) {
        music.play();
    }
}
window.addEventListener("load", function () {
    setTimeout(function () {
        resizeCanvas();
    }, 0);
    window.addEventListener("orientationchange", function () {
        setTimeout(function () {
            resizeCanvas();
        }, 500);
        setTimeout(function () {
            resizeCanvas();
        }, 2000);
    }, false);
});
function isStock() {
    var matches = window.navigator.userAgent.match(/Android.*AppleWebKit\/([\d.]+)/);
    return matches && parseFloat(matches[1]) < 537;
}
var ua = navigator.userAgent;
var isSharpStock = ((/SHL24|SH-01F/i).test(ua)) && isStock();
var isXperiaAStock = ((/SO-04E/i).test(ua)) && isStock();
var isFujitsuStock = ((/F-01F/i).test(ua)) && isStock();
if(!isIE10 && !isSharpStock && !isXperiaAStock && !isFujitsuStock && (typeof (window).AudioContext !== 'undefined' || typeof (window).webkitAudioContext !== 'undefined' || navigator.userAgent.indexOf('Android') == -1)) {
    audioType = 1;
    sound = new Howl({
        src: [
            'audio/sound.ogg', 
            'audio/sound.m4a'
        ],
        sprite: {
            bounce0: [
                0, 
                400
            ],
            bounce1: [
                500, 
                400
            ],
            bounce2: [
                1000, 
                400
            ],
            bounce3: [
                1500, 
                400
            ],
            bounce4: [
                2000, 
                400
            ],
            bounce5: [
                2500, 
                400
            ],
            hit0: [
                3000, 
                400
            ],
            hit1: [
                3500, 
                400
            ],
            hit2: [
                4000, 
                400
            ],
            hit3: [
                4500, 
                400
            ],
            hit4: [
                5000, 
                400
            ],
            hit5: [
                5500, 
                400
            ],
            hitNet: [
                6000, 
                1300
            ],
            userPoint: [
                7500, 
                700
            ],
            enemyPoint: [
                8500, 
                700
            ],
            loseGame: [
                9500, 
                1400
            ],
            gameStart: [
                11000, 
                900
            ],
            cheer2: [
                12000, 
                3500
            ],
            winGame: [
                16000, 
                6600
            ],
            cheer4: [
                23000, 
                5000
            ],
            cheer3: [
                28500, 
                4500
            ],
            cheer0: [
                33500, 
                3300
            ],
            cheer1: [
                37500, 
                4500
            ],
            firework: [
                42500, 
                1500
            ],
            drumRoll: [
                44500, 
                2500
            ]
        }
    });
    music = new Howl({
        src: [
            'audio/music.ogg', 
            'audio/music.m4a'
        ],
        volume: 0,
        loop: true
    });
} else {
    audioType = 0;
}
var panel;
var background;
var totalScore = 0;
var levelScore = 0;
var levelNum = 0;
var aLevelUps;
var levelBonusScore;
var bonusScore;
var aTutorials = new Array();
var panelFrame;
var oLogoData = {
};
var oLogoBut;
var oImageIds = {
};
var tableTop;
var userBat;
var enemyBat;
var ball;
var swipeState = 0;
var countryFlags = new Utils.CountryFlags([
    "CA", 
    "CN", 
    "CZ", 
    "DK", 
    "DE", 
    "FR", 
    "HK", 
    "IN", 
    "IE", 
    "IT", 
    "JP", 
    "NL", 
    "PL", 
    "PT", 
    "KR", 
    "ES", 
    "RU", 
    "TR", 
    "GB", 
    "US", 
    
], false);
var aEnemyCountries = new Array([
    "IS", 
    "GL", 
    "HW", 
    "CU", 
    "CA", 
    "US"
], [
    "VE", 
    "CK", 
    "WS", 
    "CO", 
    "GY", 
    "CR"
], [
    "PE", 
    "AR", 
    "UY", 
    "BO", 
    "CL", 
    "BR"
], [
    "DZ", 
    "LY", 
    "ET", 
    "ZW", 
    "KE", 
    "ZA"
], [
    "FR", 
    "NO", 
    "PT", 
    "IT", 
    "DE", 
    "GB"
], [
    "AT", 
    "CZ", 
    "PL", 
    "TR", 
    "HU", 
    "GR"
], [
    "IR", 
    "BD", 
    "MG", 
    "IN", 
    "PK", 
    "AE"
], [
    "PG", 
    "NZ", 
    "AU", 
    "PH", 
    "ID", 
    "MY"
], [
    "LA", 
    "VN", 
    "HK", 
    "JP", 
    "KR", 
    "CN"
], [
    "LV", 
    "EE", 
    "LT", 
    "FI", 
    "UZ", 
    "RU"
]);
var spareEnemyCountry = "CH";
var oGameData = {
    cupId: 0,
    gameId: 0,
    userId: null,
    enemyId: null,
    userScore: 0,
    enemyScore: 0
};
var firstRun = true;
var aMapMarkerPos = new Array([
    -203, 
    -115
], [
    -150, 
    -31
], [
    -136, 
    98
], [
    20, 
    57
], [
    -36, 
    -109
], [
    50, 
    -72
], [
    101, 
    -16
], [
    170, 
    82
], [
    192, 
    -51
], [
    143, 
    -121
]);
var justWonCup = false;
var controlState = 0;
var startTouchY;
var aEffects;
var rallyHits = 0;
var gameType;
var curLevel;
var curChar = 99;
var opChar = 99;
var aOpStats = new Array([
    .2, 
    .2, 
    .2
], [
    .4, 
    .2, 
    .3
], [
    .3, 
    .3, 
    .4
], [
    .5, 
    .3, 
    .4
], [
    .6, 
    .4, 
    .8
], [
    .3, 
    .2, 
    .3
], [
    .3, 
    .4, 
    .6
], [
    .6, 
    .4, 
    .7
], [
    .1, 
    .1, 
    .2
], [
    .4, 
    .3, 
    .6
], [
    .5, 
    .4, 
    .7
], [
    .6, 
    .5, 
    .5
], [
    .7, 
    .6, 
    .4
], [
    .8, 
    .7, 
    .7
]);
var aTournamentPreorder = new Array(8, 0, 5, 2, 1, 6, 3, 7, 4);
var alevelThemes = new Array(0, 1, 2, 3, 4, 5, 6, 2, 1, 2, 1, 4, 7, 3);
var aTournamentOrder = new Array();
var endChatId = 0;
var tournamentSize = 6;
var charLineUp = 0;
var prevCanvasWidth = 0;
var prevCanvasWHeight = 0;
loadLang();
function loadLang() {
    var xobj = new XMLHttpRequest();
    xobj.open('GET', "json/lang.json", true);
    xobj.onreadystatechange = function () {
        if(xobj.readyState == 4 && xobj.status == 200) {
            curLang = JSON.parse(xobj.responseText).lang;
            charLineUp = JSON.parse(xobj.responseText).charLineUp;
            loadPreAssets();
        }
    };
    xobj.send(null);
}
function initSplash() {
    firstRun = true;
    gameState = "splash";
    if(audioType == 1 && !muted) {
        playMusic();
        if(!hasFocus) {
            music.pause();
        }
    }
    initStartScreen();
    resizeCanvas();
    setTimeout(function () {
        resizeCanvas();
    }, 2000);
}
function initStartScreen() {
    gameState = "start";
    if(audioType == 1) {
        music.fade(music.volume(), .3, 200);
    }
    userInput.removeHitArea("moreGames");
    if(audioType == 1) {
    }
    background = new Elements.Background();
    var oTournament0But = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            -160, 
            140
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.tournament0But,
        idOver: oImageIds.tournament0ButOver,
        flash: true
    };
    var oTournament1But = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            0, 
            140
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.tournament1But,
        idOver: oImageIds.tournament1ButOver,
        flash: true
    };
    var oQuickGameBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            160, 
            140
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.quickGameBut,
        idOver: oImageIds.quickGameButOver,
        flash: true
    };
    var oInfoBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            40, 
            40
        ],
        align: [
            0, 
            0
        ],
        id: oImageIds.infoBut,
        idOver: oImageIds.infoButOver
    };
    userInput.addHitArea("tournamentFromStart", butEventHandler, {
        id: 6
    }, "image", oTournament0But);
    userInput.addHitArea("tournamentFromStart", butEventHandler, {
        id: 13
    }, "image", oTournament1But);
    userInput.addHitArea("quickGameFromStart", butEventHandler, null, "image", oQuickGameBut);
    userInput.addHitArea("credits", butEventHandler, null, "image", oInfoBut);
    var aButs = new Array(oTournament0But, oTournament1But, oQuickGameBut, oInfoBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween();
    previousTime = new Date().getTime();
    resizeCanvas();
    updateStartScreenEvent();
}
function addMuteBut(_aButs) {
    if(audioType == 1) {
        var mb = oImageIds.muteBut0;
        var mbOver = oImageIds.muteBut0Over;
        if(muted) {
            mb = oImageIds.muteBut1;
            mbOver = oImageIds.muteBut1Over;
        }
        var oMuteBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                -40, 
                40
            ],
            align: [
                1, 
                0
            ],
            id: mb,
            idOver: mbOver
        };
        userInput.addHitArea("mute", butEventHandler, null, "image", oMuteBut);
        for(var i = 0; i < _aButs.length; i++) {
            if(_aButs[i].id == oImageIds.muteBut0 || _aButs[i].id == oImageIds.muteBut1) {
                return;
            }
        }
        _aButs.push(oMuteBut);
    }
}
function initCreditsScreen() {
    gameState = "credits";
    var oBackBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            40, 
            -40
        ],
        align: [
            0, 
            1
        ],
        id: oImageIds.backBut,
        idOver: oImageIds.backButOver
    };
    var oResetBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            -40, 
            -40
        ],
        align: [
            1, 
            1
        ],
        id: oImageIds.resetBut,
        idOver: oImageIds.resetButOver
    };
    userInput.addHitArea("backFromCredits", butEventHandler, null, "image", oBackBut);
    userInput.addHitArea("resetData", butEventHandler, null, "image", oResetBut);
    var aButs = new Array(oBackBut, oResetBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween();
    previousTime = new Date().getTime();
    resizeCanvas();
    updateCreditsScreenEvent();
}
function initCharSelect(_gameType) {
    gameState = "charSelect";
    gameType = _gameType;
    curChar = 99;
    opChar = 99;
    var oBackBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            40, 
            -40
        ],
        align: [
            0, 
            1
        ],
        id: oImageIds.backBut,
        idOver: oImageIds.backButOver
    };
    userInput.addHitArea("backFromCharSelect", butEventHandler, null, "image", oBackBut);
    var aButs = new Array(oBackBut);
    var aTemp = saveDataHandler.getUnlockedCharData();
    for(var i = 0; i < 14; i++) {
        if(i < 9 || (i > 8 && aTemp[i - 9] == 1)) {
            var oCharBut = {
                oImgData: assetLib.getData("uiButs"),
                aPos: [
                    (i % 7) * 80 - (3 * 80), 
                    Math.floor(i / 7) * 80 + 82
                ],
                align: [
                    .5, 
                    .5
                ],
                id: oImageIds["charBut" + i],
                idOver: oImageIds["charBut" + i + "Over"],
                flash: true
            };
            userInput.addHitArea("charSelectA", butEventHandler, {
                id: i
            }, "image", oCharBut);
        } else {
            var oCharBut = {
                oImgData: assetLib.getData("uiButs"),
                aPos: [
                    (i % 7) * 80 - (3 * 80), 
                    Math.floor(i / 7) * 80 + 82
                ],
                align: [
                    .5, 
                    .5
                ],
                id: oImageIds.charButLocked,
                idOver: oImageIds.charButLocked
            };
            userInput.addHitArea("charSelectA", butEventHandler, {
                id: 100 + i
            }, "image", oCharBut);
        }
        aButs.push(oCharBut);
    }
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween();
    previousTime = new Date().getTime();
    resizeCanvas();
    updateCharSelectScreenEvent();
}
function initProgress() {
    gameState = "progress";
    if(audioType == 1) {
        music.fade(music.volume(), 0, 200);
    }
    playSound("drumRoll");
    setTournamentOrder();
    opChar = aTournamentOrder[saveDataHandler.getNextLevel(curChar)];
    var aButs = new Array();
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween();
    aEffects = new Array();
    previousTime = new Date().getTime();
    resizeCanvas();
    updateProgressScreenEvent();
}
function initGameIntro() {
    gameState = "gameIntro";
    var oBackBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            40, 
            -40
        ],
        align: [
            0, 
            1
        ],
        id: oImageIds.backBut,
        idOver: oImageIds.backButOver
    };
    userInput.addHitArea("backFromGameIntro", butEventHandler, null, "image", oBackBut);
    var oPlayBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            -52, 
            -54
        ],
        align: [
            1, 
            1
        ],
        id: oImageIds.playBut,
        idOver: oImageIds.playButOver,
        flash: true
    };
    userInput.addHitArea("playFromGameIntro", butEventHandler, null, "image", oPlayBut);
    var aButs = new Array(oBackBut, oPlayBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween();
    previousTime = new Date().getTime();
    resizeCanvas();
    updateGameIntroScreenEvent();
}
function initGame() {
    gameState = "game";
    playSound("gameStart");
    playSound("cheer" + Math.floor(Math.random() * 4));
    if(audioType == 1) {
        music.fade(music.volume(), .18, 1000);
    }
    oGameData.userScore = 0;
    oGameData.enemyScore = 0;
    justWonCup = false;
    background = new Elements.Background();
    var aButs = new Array();
    if(!firstRun) {
        if(isMobile) {
            userInput.addHitArea("gameTouch", butEventHandler, {
                isDraggable: true,
                multiTouch: true
            }, "rect", {
                aRect: [
                    0, 
                    50, 
                    canvas.width, 
                    canvas.height
                ]
            }, true);
        }
        var oPauseBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                40, 
                40
            ],
            align: [
                0, 
                0
            ],
            id: oImageIds.pauseBut,
            idOver: oImageIds.pauseButOver
        };
        userInput.addHitArea("pause", butEventHandler, null, "image", oPauseBut);
        aButs.push(oPauseBut);
    } else {
        var oTickBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                0, 
                180
            ],
            align: [
                .5, 
                .5
            ],
            id: oImageIds.tickBut,
            idOver: oImageIds.tickButOver,
            flash: true
        };
        userInput.addHitArea("tickFromTut", butEventHandler, null, "image", oTickBut);
        aButs.push(oTickBut);
    }
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween();
    if(firstRun) {
        panel.startTut();
    }
    tableTop = new Elements.TableTop();
    userBat = new Elements.UserBat();
    enemyBat = new Elements.EnemyBat();
    ball = new Elements.Ball();
    previousTime = new Date().getTime();
    resizeCanvas();
    updateGameEvent();
}
function initPause() {
    gameState = "pause";
    var oPlayBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            -120, 
            150
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.playBut,
        idOver: oImageIds.playButOver
    };
    var oRestartBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            0, 
            150
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.replayBut,
        idOver: oImageIds.replayButOver
    };
    var oQuitBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            120, 
            150
        ],
        align: [
            .5, 
            .5
        ],
        id: oImageIds.quitBut,
        idOver: oImageIds.quitButOver
    };
    userInput.addHitArea("playFromPause", butEventHandler, null, "image", oPlayBut);
    userInput.addHitArea("restartFromPause", butEventHandler, null, "image", oRestartBut);
    userInput.addHitArea("quitFromPause", butEventHandler, null, "image", oQuitBut);
    var aButs = new Array(oPlayBut, oRestartBut, oQuitBut);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween();
    previousTime = new Date().getTime();
    resizeCanvas();
    background = new Elements.Background();
    updatePauseEvent();
}
function resumeGame() {
    gameState = "game";
    background = new Elements.Background();
    if(isMobile) {
        userInput.addHitArea("gameTouch", butEventHandler, {
            isDraggable: true,
            multiTouch: true
        }, "rect", {
            aRect: [
                0, 
                50, 
                canvas.width, 
                canvas.height
            ]
        }, true);
    }
    var oPauseBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            40, 
            40
        ],
        align: [
            0, 
            0
        ],
        id: oImageIds.pauseBut,
        idOver: oImageIds.pauseButOver
    };
    userInput.addHitArea("pause", butEventHandler, null, "image", oPauseBut);
    var aButs = new Array(oPauseBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween();
    previousTime = new Date().getTime();
    resizeCanvas();
    updateGameEvent();
}
function initTournamentWinScreen() {
    gameState = "tournamentWin";
    playSound("winGame");
    background = new Elements.Background();
    var oPlayBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            -52, 
            -54
        ],
        align: [
            1, 
            1
        ],
        id: oImageIds.playBut,
        idOver: oImageIds.playButOver,
        flash: true
    };
    userInput.addHitArea("playFromTournamentWin", butEventHandler, null, "image", oPlayBut);
    var aButs = new Array(oPlayBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween();
    aEffects = new Array();
    previousTime = new Date().getTime();
    resizeCanvas();
    updateTournamentWinEvent();
}
function butEventHandler(_id, _oData) {
    if(isRotated) {
        return;
    }
    switch(_id) {
        case "winGameTest":
            oGameData.userScore = 11;
            oGameData.enemyScore = 9;
            initGameComplete();
            break;
        case "langSelect":
            curLang = _oData.lang;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            userInput.removeHitArea("langSelect");
            preAssetLib = new Utils.AssetLoader(curLang, [
                {
                    id: "preloadImage",
                    file: "images/preloadImage.jpg"
                }
            ], ctx, canvas.width, canvas.height, false);
            preAssetLib.onReady(initLoadAssets);
            break;
        case "credits":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("playFromStart");
            userInput.removeHitArea("moreGames");
            userInput.removeHitArea("credits");
            userInput.removeHitArea("cupsFromStart");
            userInput.removeHitArea("mute");
            initCreditsScreen();
            break;
        case "resetData":
            playSound("hit" + Math.floor(Math.random() * 6));
            saveDataHandler.resetData();
            userInput.removeHitArea("backFromCredits");
            userInput.removeHitArea("resetData");
            userInput.removeHitArea("mute");
            initCreditsScreen();
            break;
        case "backFromCredits":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("backFromCredits");
            userInput.removeHitArea("resetData");
            userInput.removeHitArea("mute");
            initStartScreen();
            break;
        case "tournamentFromStart":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("quickGameFromStart");
            userInput.removeHitArea("tournamentFromStart");
            userInput.removeHitArea("credits");
            userInput.removeHitArea("mute");
            if(tournamentSize != _oData.id) {
                firstRun = true;
            }
            tournamentSize = _oData.id;
            initCharSelect(0);
            break;
        case "quickGameFromStart":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("quickGameFromStart");
            userInput.removeHitArea("tournamentFromStart");
            userInput.removeHitArea("credits");
            userInput.removeHitArea("mute");
            if(tournamentSize == 13) {
                firstRun = true;
            }
            tournamentSize = 6;
            initCharSelect(1);
            break;
        case "backFromCharSelect":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("backFromCharSelect");
            userInput.removeHitArea("charSelectA");
            userInput.removeHitArea("playFromCharSelect");
            userInput.removeHitArea("mute");
            initStartScreen();
            break;
        case "charSelectA":
            if(_oData.id > 100) {
                if(gameType == 0 || panel.charSelectState == 0 || (panel.charSelectState == 1 && curChar > 100)) {
                    panel.charSelectState = 1;
                    curChar = _oData.id;
                    panel.tweenInChar(2);
                    userInput.removeHitArea("playFromCharSelect");
                    panel.removeBut(oImageIds.playBut);
                    break;
                } else {
                    break;
                }
            }
            if(curChar > 100 && panel.charSelectState == 1) {
                panel.charSelectState = 0;
                panel.promptOffScreen = false;
            }
            playSound("hit" + Math.floor(Math.random() * 6));
            if(gameType == 0) {
                if(curChar >= 99) {
                    var oPlayBut = {
                        oImgData: assetLib.getData("uiButs"),
                        aPos: [
                            -52, 
                            -54
                        ],
                        align: [
                            1, 
                            1
                        ],
                        id: oImageIds.playBut,
                        idOver: oImageIds.playButOver,
                        flash: true
                    };
                    userInput.addHitArea("playFromCharSelect", butEventHandler, null, "image", oPlayBut);
                    panel.aButs.push(oPlayBut);
                }
                panel.charSelectState = 1;
                curChar = _oData.id;
                panel.tweenInChar(0);
            } else {
                if(panel.charSelectState == 0) {
                    panel.charSelectState = 1;
                    curChar = _oData.id;
                    panel.tweenInChar(0);
                    var oResetBut = {
                        oImgData: assetLib.getData("uiButs"),
                        aPos: [
                            40, 
                            36
                        ],
                        align: [
                            0, 
                            .5
                        ],
                        id: oImageIds.resetBut,
                        idOver: oImageIds.resetButOver
                    };
                    userInput.addHitArea("resetFromCharSelect", butEventHandler, null, "image", oResetBut);
                    panel.aButs.push(oResetBut);
                } else if(panel.charSelectState == 1 && curChar != _oData.id && opChar != _oData.id) {
                    if(opChar == 99) {
                        var oPlayBut = {
                            oImgData: assetLib.getData("uiButs"),
                            aPos: [
                                -52, 
                                -54
                            ],
                            align: [
                                1, 
                                1
                            ],
                            id: oImageIds.playBut,
                            idOver: oImageIds.playButOver,
                            flash: true
                        };
                        userInput.addHitArea("playFromCharSelect", butEventHandler, null, "image", oPlayBut);
                        panel.aButs.push(oPlayBut);
                    }
                    opChar = _oData.id;
                    panel.tweenInChar(1);
                }
            }
            break;
        case "playFromCharSelect":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("backFromCharSelect");
            userInput.removeHitArea("charSelectA");
            userInput.removeHitArea("playFromCharSelect");
            userInput.removeHitArea("mute");
            if(gameType == 0) {
                saveDataHandler.resetSingleChar(curChar);
                initProgress();
            } else {
                initGame();
            }
            break;
        case "resetFromCharSelect":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("resetFromCharSelect");
            panel.removeBut(oImageIds.resetBut);
            userInput.removeHitArea("playFromCharSelect");
            panel.removeBut(oImageIds.playBut);
            panel.tweenOffChars();
            break;
        case "backFromGameIntro":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("backFromGameIntro");
            userInput.removeHitArea("playFromGameIntro");
            initStartScreen();
            break;
        case "playFromGameIntro":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("backFromGameIntro");
            userInput.removeHitArea("playFromGameIntro");
            userInput.removeHitArea("mute");
            initGame();
            break;
        case "tickFromTut":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("tickFromTut");
            userInput.removeHitArea("mute");
            panel.aButs = new Array();
            userInput.addHitArea("gameTouch", butEventHandler, {
                isDraggable: true,
                multiTouch: true
            }, "rect", {
                aRect: [
                    0, 
                    50, 
                    canvas.width, 
                    canvas.height
                ]
            }, true);
            var oPauseBut = {
                oImgData: assetLib.getData("uiButs"),
                aPos: [
                    40, 
                    40
                ],
                align: [
                    0, 
                    0
                ],
                id: oImageIds.pauseBut,
                idOver: oImageIds.pauseButOver
            };
            userInput.addHitArea("pause", butEventHandler, null, "image", oPauseBut);
            panel.aButs.push(oPauseBut);
            addMuteBut(panel.aButs);
            firstRun = false;
            break;
        case "gameTouch":
            if(_oData.isDown && !_oData.isBeingDragged) {
                swipeState = 1;
                startTouchY = _oData.y - userBat.targY;
            } else if(swipeState == 1 && _oData.isBeingDragged) {
                userBat.targX = _oData.x;
                if(controlState == 0) {
                    userBat.targY = _oData.y;
                } else {
                    userBat.targY = _oData.y - startTouchY;
                }
            } else {
                if(swipeState == 1) {
                    swipeState = 0;
                }
            }
            break;
        case "backFromGameComplete":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("backFromGameComplete");
            userInput.removeHitArea("playFromGameComplete");
            userInput.removeHitArea("replayFromGameComplete");
            userInput.removeHitArea("mute");
            initStartScreen();
            break;
        case "replayFromGameComplete":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("backFromGameComplete");
            userInput.removeHitArea("playFromGameComplete");
            userInput.removeHitArea("replayFromGameComplete");
            userInput.removeHitArea("mute");
            initGame();
            break;
        case "playFromGameComplete":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("backFromGameComplete");
            userInput.removeHitArea("playFromGameComplete");
            userInput.removeHitArea("replayFromGameComplete");
            userInput.removeHitArea("mute");
            if(gameType == 0) {
                if(saveDataHandler.getNextLevel(curChar) < tournamentSize) {
                    initProgress();
                } else {
                    initTournamentWinScreen();
                }
            } else {
                initStartScreen();
            }
            break;
        case "mute":
            playSound("hit" + Math.floor(Math.random() * 6));
            toggleMute();
            if(muted) {
                panel.switchBut(oImageIds.muteBut0, oImageIds.muteBut1, oImageIds.muteBut1Over);
            } else {
                panel.switchBut(oImageIds.muteBut1, oImageIds.muteBut0, oImageIds.muteBut0Over);
            }
            break;
        case "pause":
            playSound("hit" + Math.floor(Math.random() * 6));
            if(audioType == 1) {
                Howler.mute(true);
                music.pause();
            } else if(audioType == 2) {
                music.pause();
            }
            userInput.removeHitArea("pause");
            userInput.removeHitArea("gameTouch");
            userInput.removeHitArea("mute");
            initPause();
            break;
        case "playFromPause":
            playSound("hit" + Math.floor(Math.random() * 6));
            if(audioType == 1) {
                if(!muted) {
                    Howler.mute(false);
                    playMusic();
                }
            } else if(audioType == 2) {
                if(!muted) {
                    playMusic();
                }
            }
            userInput.removeHitArea("quitFromPause");
            userInput.removeHitArea("playFromPause");
            userInput.removeHitArea("restartFromPause");
            userInput.removeHitArea("mute");
            resumeGame();
            break;
        case "restartFromPause":
            playSound("hit" + Math.floor(Math.random() * 6));
            if(audioType == 1) {
                if(!muted) {
                    Howler.mute(false);
                    playMusic();
                }
            } else if(audioType == 2) {
                if(!muted) {
                    playMusic();
                }
            }
            userInput.removeHitArea("quitFromPause");
            userInput.removeHitArea("playFromPause");
            userInput.removeHitArea("restartFromPause");
            userInput.removeHitArea("mute");
            initGame();
            break;
        case "quitFromPause":
            playSound("hit" + Math.floor(Math.random() * 6));
            if(audioType == 1) {
                if(!muted) {
                    Howler.mute(false);
                    playMusic();
                }
                music.fade(music.volume(), .3, 500);
            } else if(audioType == 2) {
                if(!muted) {
                    playMusic();
                }
            }
            userInput.removeKey("winGameTest");
            userInput.removeHitArea("quitFromPause");
            userInput.removeHitArea("playFromPause");
            userInput.removeHitArea("restartFromPause");
            userInput.removeHitArea("mute");
            initStartScreen();
            break;
        case "playFromTournamentWin":
            playSound("hit" + Math.floor(Math.random() * 6));
            userInput.removeHitArea("playFromTournamentWin");
            userInput.removeHitArea("mute");
            initStartScreen();
            break;
    }
}
function getEndChatId() {
    endChatId++;
    return endChatId % 3;
}
function setTournamentOrder() {
    var aBosses = new Array(9, 10, 11, 12, 13);
    aTournamentOrder = aTournamentPreorder.slice(0);
    var isBoss = true;
    for(var i = 0; i < aTournamentOrder.length; i++) {
        if(curChar == aTournamentOrder[i]) {
            aTournamentOrder.splice(i, 1);
            isBoss = false;
            break;
        }
    }
    if(isBoss) {
        for(var i = 0; i < aBosses.length; i++) {
            if(curChar == aBosses[i]) {
                aBosses.splice(i, 1);
                break;
            }
        }
        aBosses.splice(0, 0, aTournamentOrder[aTournamentOrder.length - 1]);
        aTournamentOrder.splice(aTournamentOrder.length - 1, 1);
    }
    for(var i = 0; i < aTournamentOrder.length; i++) {
        if(i == 2) {
            aTournamentOrder.splice(2, 0, aBosses[0]);
        }
        if(i == 4) {
            aTournamentOrder.splice(5, 0, aBosses[1]);
        }
        if(i == 6) {
            aTournamentOrder.splice(8, 0, aBosses[2]);
        }
        if(i == 8) {
            aTournamentOrder.splice(11, 0, aBosses[3]);
        }
    }
    aTournamentOrder.push(aBosses[4]);
}
function addDirectText(_font, _size, _width, _align, _x, _y, _str, _col) {
    if (typeof _col === "undefined") { _col = "#202020"; }
    ctx.fillStyle = _col;
    ctx.textAlign = _align;
    ctx.font = _size + "px " + assetLib.textData.langText["font" + _font][curLang];
    ctx.fillText(_str, _x, _y);
}
function addText(_font, _size, _width, _align, _x, _y, _str, _col) {
    if (typeof _col === "undefined") { _col = "#202020"; }
    ctx.fillStyle = _col;
    ctx.textAlign = _align;
    if(_width < getTextWidth(_font, _size, _str)) {
        var breakCount = 0;
        _size--;
        while(_width < getTextWidth(_font, _size, _str)) {
            _size--;
            if(breakCount > 100) {
                break;
            }
        }
    }
    if(curLang == "ar") {
        _y -= _size / 15;
    }
    ctx.font = _size + "px " + assetLib.textData.langText["font" + _font][curLang];
    ctx.fillText(getText(_str), _x, _y);
}
function getText(_str) {
    var tempText = assetLib.textData.langText[_str][curLang];
    if(curLang == "de") {
    }
    return tempText;
}
function getTextWidth(_font, _size, _str) {
    ctx.font = _size + "px " + assetLib.textData.langText["font" + _font][curLang];
    var metrics = ctx.measureText(getText(_str));
    return metrics.width;
}
function getCorrectedTextWidth(_font, _size, _width, _str) {
    if(_width < getTextWidth(_font, _size, _str)) {
        var breakCount = 0;
        _size--;
        while(_width < getTextWidth(_font, _size, _str)) {
            _size--;
            if(breakCount > 100) {
                break;
            }
        }
    }
    ctx.font = _size + "px " + assetLib.textData.langText["font" + _font][curLang];
    var metrics = ctx.measureText(getText(_str));
    return metrics.width;
}
function checkButtonsOver() {
    if(isMobile) {
        return;
    }
    for(var i = 0; i < panel.aButs.length; i++) {
        panel.aButs[i].isOver = false;
        if(userInput.mouseX > panel.aButs[i].aOverData[0] && userInput.mouseX < panel.aButs[i].aOverData[2] && userInput.mouseY > panel.aButs[i].aOverData[1] && userInput.mouseY < panel.aButs[i].aOverData[3]) {
            panel.aButs[i].isOver = true;
        }
    }
}
function clearButtonOvers() {
    userInput.mouseX = -100;
    userInput.mouseY = -100;
}
function updateScore(_player) {
    panel.cardTween(_player);
    if(rallyHits <= 4 && Math.random() > .5) {
        playSound("cheer" + Math.floor(Math.random() * 2));
    } else if(rallyHits > 4 && rallyHits <= 7) {
        playSound("cheer" + (1 + Math.floor(Math.random() * 2)));
    } else if(rallyHits > 7 && rallyHits <= 10) {
        playSound("cheer" + (2 + Math.floor(Math.random() * 2)));
    } else if(rallyHits > 10) {
        playSound("cheer" + (3 + Math.floor(Math.random() * 2)));
    }
    if(_player == "user") {
        oGameData.userScore++;
        playSound("userPoint");
        panel.tweenGameChar(0);
        if(tournamentSize == 6 && oGameData.userScore >= 5) {
            initGameComplete();
        } else if(tournamentSize == 13 && oGameData.userScore >= 10) {
            initGameComplete();
        }
    } else {
        oGameData.enemyScore++;
        playSound("enemyPoint");
        panel.tweenGameChar(1);
        if(tournamentSize == 6 && oGameData.enemyScore >= 5) {
            initGameComplete();
        } else if(tournamentSize == 13 && oGameData.enemyScore >= 10) {
            initGameComplete();
        }
    }
}
function initGameComplete() {
    gameState = "gameComplete";
    userInput.removeKey("winGameTest");
    if(audioType == 1) {
        music.fade(music.volume(), .3, 500);
    }
    userInput.removeHitArea("pause");
    userInput.removeHitArea("gameTouch");
    var oBackBut = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [
            40, 
            -40
        ],
        align: [
            0, 
            1
        ],
        id: oImageIds.backBut,
        idOver: oImageIds.backButOver
    };
    userInput.addHitArea("backFromGameComplete", butEventHandler, null, "image", oBackBut);
    var aButs = new Array(oBackBut);
    var oNextBut;
    if(oGameData.userScore > oGameData.enemyScore) {
        playSound("winGame");
        if(gameType == 0) {
            saveDataHandler.setLevelProgress(curChar, saveDataHandler.getNextLevel(curChar) + 1);
            saveDataHandler.saveData();
        }
        var oPlayBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                -52, 
                -54
            ],
            align: [
                1, 
                1
            ],
            id: oImageIds.playBut,
            idOver: oImageIds.playButOver,
            flash: true
        };
        userInput.addHitArea("playFromGameComplete", butEventHandler, null, "image", oPlayBut);
        aButs.push(oPlayBut);
    } else {
        playSound("loseGame");
        var oReplayBut = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [
                -52, 
                -54
            ],
            align: [
                1, 
                1
            ],
            id: oImageIds.replayBut,
            idOver: oImageIds.replayButOver,
            flash: true
        };
        userInput.addHitArea("replayFromGameComplete", butEventHandler, null, "image", oReplayBut);
        aButs.push(oReplayBut);
    }
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween();
    aEffects = new Array();
    previousTime = new Date().getTime();
    resizeCanvas();
    updateGameComplete();
}
function addFirework(_x, _y, _scale) {
    if (typeof _scale === "undefined") { _scale = 1; }
    if(aEffects.length > 10) {
        return;
    }
    var firework = new Elements.Firework();
    firework.x = _x;
    firework.y = _y;
    firework.scaleX = firework.scaleY = _scale;
    aEffects.push(firework);
}
function updateGameEvent() {
    if(gameState != "game") {
        return;
    }
    delta = getDelta();
    background.renderGame();
    ball.update();
    enemyBat.update();
    if((ball.offTable || ball.offSide) || (ball.height < 0 && ball.tablePosY < .5 && (ball.tablePosX < -1 || ball.tablePosX > 1))) {
        ball.render();
        tableTop.render();
        enemyBat.render();
        tableTop.renderNet();
    } else if(ball.tablePosY > .5) {
        tableTop.render();
        enemyBat.render();
        tableTop.renderNet();
        ball.render();
    } else if(ball.tablePosY < .5) {
        tableTop.render();
        enemyBat.render();
        ball.render();
        tableTop.renderNet();
    }
    userBat.update();
    userBat.render();
    panel.update();
    panel.render();
    checkButtonsOver();
    requestAnimFrame(updateGameEvent);
}
function updateCreditsScreenEvent() {
    if(gameState != "credits") {
        return;
    }
    delta = getDelta();
    background.renderMenu();
    panel.update();
    panel.render();
    ctx.fillStyle = "#555555";
    ctx.textAlign = "center";
    ctx.font = "italic 15px Helvetica";
    ctx.fillText("v1.0.0", canvas.width / 2, canvas.height - 20);
    checkButtonsOver();
    requestAnimFrame(updateCreditsScreenEvent);
}
function updateGameComplete() {
    if(gameState != "gameComplete") {
        return;
    }
    delta = getDelta();
    background.renderMenu();
    panel.update();
    panel.render();
    if(oGameData.userScore > oGameData.enemyScore && Math.random() < .06) {
        playSound("firework");
        addFirework(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1 + 2);
    }
    for(var i = 0; i < aEffects.length; i++) {
        aEffects[i].update();
        aEffects[i].render(ctx);
        if(aEffects[i].removeMe) {
            aEffects.splice(i, 1);
            i -= 1;
        }
    }
    checkButtonsOver();
    requestAnimFrame(updateGameComplete);
}
function updateSplashScreenEvent() {
    if(gameState != "splash") {
        return;
    }
    delta = getDelta();
    splashTimer += delta;
    if(splashTimer > 2.5) {
        if(audioType == 1 && !muted) {
            playMusic();
            if(!hasFocus) {
                music.pause();
            }
        }
        initStartScreen();
        return;
    }
    background.renderMenu();
    panel.update();
    panel.render();
    checkButtonsOver();
    requestAnimFrame(updateSplashScreenEvent);
}
function updateStartScreenEvent() {
    if(gameState != "start") {
        return;
    }
    delta = getDelta();
    background.renderMenu();
    panel.update();
    panel.render();
    checkButtonsOver();
    requestAnimFrame(updateStartScreenEvent);
}
function updateProgressScreenEvent() {
    if(gameState != "progress") {
        return;
    }
    delta = getDelta();
    background.renderMenu();
    panel.update();
    panel.render();
    for(var i = 0; i < aEffects.length; i++) {
        aEffects[i].update();
        aEffects[i].render(ctx);
        if(aEffects[i].removeMe) {
            aEffects.splice(i, 1);
            i -= 1;
        }
    }
    checkButtonsOver();
    requestAnimFrame(updateProgressScreenEvent);
}
function updateGameIntroScreenEvent() {
    if(gameState != "gameIntro") {
        return;
    }
    delta = getDelta();
    background.renderMenu();
    panel.update();
    panel.render();
    checkButtonsOver();
    requestAnimFrame(updateGameIntroScreenEvent);
}
function updateCharSelectScreenEvent() {
    if(gameState != "charSelect") {
        return;
    }
    delta = getDelta();
    background.renderMenu();
    panel.update();
    panel.render();
    checkButtonsOver();
    requestAnimFrame(updateCharSelectScreenEvent);
}
function updateLoaderEvent() {
    if(gameState != "load") {
        return;
    }
    delta = getDelta();
    assetLib.render();
    requestAnimFrame(updateLoaderEvent);
}
function updatePauseEvent() {
    if(gameState != "pause") {
        return;
    }
    delta = getDelta();
    background.renderMenu();
    panel.update();
    panel.render();
    checkButtonsOver();
    requestAnimFrame(updatePauseEvent);
}
function updateTournamentWinEvent() {
    if(gameState != "tournamentWin") {
        return;
    }
    delta = getDelta();
    background.renderMenu();
    panel.update();
    panel.render();
    if(Math.random() < .06) {
        playSound("firework");
        addFirework(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1 + 2);
    }
    for(var i = 0; i < aEffects.length; i++) {
        aEffects[i].update();
        aEffects[i].render(ctx);
        if(aEffects[i].removeMe) {
            aEffects.splice(i, 1);
            i -= 1;
        }
    }
    checkButtonsOver();
    requestAnimFrame(updateTournamentWinEvent);
}
function updateRotateWarningEvent() {
    if(gameState != "rotated") {
        return;
    }
    delta = getDelta();
    panel.update();
    panel.render(false);
    requestAnimFrame(updateRotateWarningEvent);
}
function getDelta() {
    var currentTime = new Date().getTime();
    var deltaTemp = (currentTime - previousTime) / 1000;
    previousTime = currentTime;
    if(deltaTemp > .5) {
        deltaTemp = 0;
    }
    return deltaTemp;
}
function checkSpriteCollision(_s1, _s2) {
    var s1XOffset = _s1.x;
    var s1YOffset = _s1.y;
    var s2XOffset = _s2.x;
    var s2YOffset = _s2.y;
    var distance_squared = (((s1XOffset - s2XOffset) * (s1XOffset - s2XOffset)) + ((s1YOffset - s2YOffset) * (s1YOffset - s2YOffset)));
    var radii_squared = (_s1.radius) * (_s2.radius);
    if(distance_squared < radii_squared) {
        return true;
    } else {
        return false;
    }
}
function getScaleImageToMax(_oImgData, _aLimit) {
    var newScale;
    if(_oImgData.isSpriteSheet) {
        if(_aLimit[0] / _oImgData.oData.spriteWidth < _aLimit[1] / _oImgData.oData.spriteHeight) {
            newScale = Math.min(_aLimit[0] / _oImgData.oData.spriteWidth, 1);
        } else {
            newScale = Math.min(_aLimit[1] / _oImgData.oData.spriteHeight, 1);
        }
    } else {
        if(_aLimit[0] / _oImgData.img.width < _aLimit[1] / _oImgData.img.height) {
            newScale = Math.min(_aLimit[0] / _oImgData.img.width, 1);
        } else {
            newScale = Math.min(_aLimit[1] / _oImgData.img.height, 1);
        }
    }
    return newScale;
}
function getCentreFromTopLeft(_aTopLeft, _oImgData, _imgScale) {
    var aCentre = new Array();
    aCentre.push(_aTopLeft[0] + (_oImgData.oData.spriteWidth / 2) * _imgScale);
    aCentre.push(_aTopLeft[1] + (_oImgData.oData.spriteHeight / 2) * _imgScale);
    return aCentre;
}
function loadPreAssets() {
    preAssetLib = new Utils.AssetLoader(curLang, [
        {
            id: "loader",
            file: "images/loader.png"
        }, 
        {
            id: "loadSpinner",
            file: "images/loadSpinner.png"
        }
    ], ctx, canvas.width, canvas.height, false);
    preAssetLib.onReady(initLoadAssets);
}
function initLangSelect() {
    var oImgData;
    var j;
    var k;
    var gap = 10;
    var tileWidthNum = 0;
    var tileHeightNum = 0;
    var butScale = 1;
    for(var i = 0; i < aLangs.length; i++) {
        oImgData = preAssetLib.getData("lang" + aLangs[i]);
        if((i + 1) * (oImgData.img.width * butScale) + (i + 2) * gap < canvas.width) {
            tileWidthNum++;
        } else {
            break;
        }
    }
    tileHeightNum = Math.ceil(aLangs.length / tileWidthNum);
    for(var i = 0; i < aLangs.length; i++) {
        oImgData = preAssetLib.getData("lang" + aLangs[i]);
        j = canvas.width / 2 - (tileWidthNum / 2) * (oImgData.img.width * butScale) - ((tileWidthNum - 1) / 2) * gap;
        j += (i % tileWidthNum) * ((oImgData.img.width * butScale) + gap);
        k = canvas.height / 2 - (tileHeightNum / 2) * (oImgData.img.height * butScale) - ((tileHeightNum - 1) / 2) * gap;
        k += (Math.floor(i / tileWidthNum) % tileHeightNum) * ((oImgData.img.height * butScale) + gap);
        ctx.drawImage(oImgData.img, 0, 0, oImgData.img.width, oImgData.img.height, j, k, (oImgData.img.width * butScale), (oImgData.img.height * butScale));
        var oBut = {
            oImgData: oImgData,
            aPos: [
                j + (oImgData.img.width * butScale) / 2, 
                k + (oImgData.img.height * butScale) / 2
            ],
            scale: butScale,
            id: "none",
            noMove: true
        };
        userInput.addHitArea("langSelect", butEventHandler, {
            lang: aLangs[i]
        }, "image", oBut);
    }
}
function initLoadAssets() {
    loadAssets();
}
function loadAssets() {
    assetLib = new Utils.AssetLoader(curLang, [
        {
            id: "fireNumbers",
            file: "images/fireNumbers_89x107.png"
        }, 
        {
            id: "uiButs",
            file: "images/uiButs.png",
            oAtlasData: {
                id0: {
                    x: 0,
                    y: 415,
                    width: 143,
                    height: 81
                },
                id1: {
                    x: 0,
                    y: 332,
                    width: 143,
                    height: 81
                },
                id10: {
                    x: 522,
                    y: 548,
                    width: 61,
                    height: 62
                },
                id11: {
                    x: 522,
                    y: 484,
                    width: 61,
                    height: 62
                },
                id12: {
                    x: 146,
                    y: 0,
                    width: 91,
                    height: 90
                },
                id13: {
                    x: 145,
                    y: 332,
                    width: 91,
                    height: 90
                },
                id14: {
                    x: 270,
                    y: 612,
                    width: 61,
                    height: 62
                },
                id15: {
                    x: 575,
                    y: 0,
                    width: 61,
                    height: 62
                },
                id16: {
                    x: 491,
                    y: 84,
                    width: 82,
                    height: 82
                },
                id17: {
                    x: 491,
                    y: 0,
                    width: 82,
                    height: 82
                },
                id18: {
                    x: 490,
                    y: 252,
                    width: 82,
                    height: 82
                },
                id19: {
                    x: 438,
                    y: 588,
                    width: 82,
                    height: 82
                },
                id2: {
                    x: 0,
                    y: 249,
                    width: 144,
                    height: 81
                },
                id20: {
                    x: 438,
                    y: 504,
                    width: 82,
                    height: 82
                },
                id21: {
                    x: 438,
                    y: 420,
                    width: 82,
                    height: 82
                },
                id22: {
                    x: 438,
                    y: 336,
                    width: 82,
                    height: 82
                },
                id23: {
                    x: 407,
                    y: 168,
                    width: 82,
                    height: 82
                },
                id24: {
                    x: 407,
                    y: 84,
                    width: 82,
                    height: 82
                },
                id25: {
                    x: 407,
                    y: 0,
                    width: 82,
                    height: 82
                },
                id26: {
                    x: 354,
                    y: 588,
                    width: 82,
                    height: 82
                },
                id27: {
                    x: 354,
                    y: 504,
                    width: 82,
                    height: 82
                },
                id28: {
                    x: 354,
                    y: 420,
                    width: 82,
                    height: 82
                },
                id29: {
                    x: 491,
                    y: 168,
                    width: 82,
                    height: 82
                },
                id3: {
                    x: 0,
                    y: 166,
                    width: 144,
                    height: 81
                },
                id30: {
                    x: 354,
                    y: 336,
                    width: 82,
                    height: 82
                },
                id31: {
                    x: 323,
                    y: 168,
                    width: 82,
                    height: 82
                },
                id32: {
                    x: 323,
                    y: 84,
                    width: 82,
                    height: 82
                },
                id33: {
                    x: 323,
                    y: 0,
                    width: 82,
                    height: 82
                },
                id34: {
                    x: 322,
                    y: 252,
                    width: 82,
                    height: 82
                },
                id35: {
                    x: 270,
                    y: 528,
                    width: 82,
                    height: 82
                },
                id36: {
                    x: 270,
                    y: 444,
                    width: 82,
                    height: 82
                },
                id37: {
                    x: 270,
                    y: 360,
                    width: 82,
                    height: 82
                },
                id38: {
                    x: 406,
                    y: 252,
                    width: 82,
                    height: 82
                },
                id39: {
                    x: 239,
                    y: 84,
                    width: 82,
                    height: 82
                },
                id4: {
                    x: 585,
                    y: 420,
                    width: 61,
                    height: 62
                },
                id40: {
                    x: 239,
                    y: 0,
                    width: 82,
                    height: 82
                },
                id41: {
                    x: 238,
                    y: 276,
                    width: 82,
                    height: 82
                },
                id42: {
                    x: 186,
                    y: 592,
                    width: 82,
                    height: 82
                },
                id43: {
                    x: 186,
                    y: 508,
                    width: 82,
                    height: 82
                },
                id44: {
                    x: 522,
                    y: 336,
                    width: 81,
                    height: 82
                },
                id45: {
                    x: 146,
                    y: 184,
                    width: 91,
                    height: 90
                },
                id46: {
                    x: 146,
                    y: 92,
                    width: 91,
                    height: 90
                },
                id47: {
                    x: 522,
                    y: 420,
                    width: 61,
                    height: 62
                },
                id48: {
                    x: 585,
                    y: 484,
                    width: 61,
                    height: 62
                },
                id49: {
                    x: 93,
                    y: 590,
                    width: 91,
                    height: 90
                },
                id5: {
                    x: 575,
                    y: 128,
                    width: 61,
                    height: 62
                },
                id50: {
                    x: 93,
                    y: 498,
                    width: 91,
                    height: 90
                },
                id51: {
                    x: 585,
                    y: 548,
                    width: 61,
                    height: 62
                },
                id52: {
                    x: 585,
                    y: 612,
                    width: 61,
                    height: 62
                },
                id53: {
                    x: 0,
                    y: 590,
                    width: 91,
                    height: 90
                },
                id54: {
                    x: 0,
                    y: 498,
                    width: 91,
                    height: 90
                },
                id55: {
                    x: 239,
                    y: 168,
                    width: 82,
                    height: 82
                },
                id56: {
                    x: 186,
                    y: 424,
                    width: 82,
                    height: 82
                },
                id57: {
                    x: 0,
                    y: 83,
                    width: 144,
                    height: 81
                },
                id58: {
                    x: 0,
                    y: 0,
                    width: 144,
                    height: 81
                },
                id6: {
                    x: 575,
                    y: 64,
                    width: 61,
                    height: 62
                },
                id7: {
                    x: 605,
                    y: 316,
                    width: 61,
                    height: 62
                },
                id8: {
                    x: 574,
                    y: 252,
                    width: 61,
                    height: 62
                },
                id9: {
                    x: 522,
                    y: 612,
                    width: 61,
                    height: 62
                }
            }
        }, 
        {
            id: "gameElements",
            file: "images/gameElements.png",
            oAtlasData: {
                id0: {
                    x: 0,
                    y: 220,
                    width: 414,
                    height: 41
                },
                id1: {
                    x: 216,
                    y: 1009,
                    width: 39,
                    height: 39
                },
                id10: {
                    x: 0,
                    y: 0,
                    width: 590,
                    height: 28
                },
                id11: {
                    x: 0,
                    y: 30,
                    width: 432,
                    height: 188
                },
                id12: {
                    x: 129,
                    y: 993,
                    width: 85,
                    height: 85
                },
                id13: {
                    x: 216,
                    y: 982,
                    width: 37,
                    height: 21
                },
                id14: {
                    x: 705,
                    y: 594,
                    width: 123,
                    height: 196
                },
                id15: {
                    x: 592,
                    y: 0,
                    width: 123,
                    height: 196
                },
                id16: {
                    x: 580,
                    y: 613,
                    width: 123,
                    height: 196
                },
                id17: {
                    x: 581,
                    y: 811,
                    width: 123,
                    height: 196
                },
                id18: {
                    x: 830,
                    y: 396,
                    width: 123,
                    height: 196
                },
                id19: {
                    x: 694,
                    y: 198,
                    width: 123,
                    height: 196
                },
                id2: {
                    x: 216,
                    y: 1050,
                    width: 37,
                    height: 21
                },
                id20: {
                    x: 717,
                    y: 0,
                    width: 123,
                    height: 196
                },
                id21: {
                    x: 705,
                    y: 396,
                    width: 123,
                    height: 196
                },
                id22: {
                    x: 830,
                    y: 594,
                    width: 123,
                    height: 196
                },
                id23: {
                    x: 842,
                    y: 0,
                    width: 123,
                    height: 196
                },
                id24: {
                    x: 706,
                    y: 792,
                    width: 123,
                    height: 196
                },
                id25: {
                    x: 580,
                    y: 415,
                    width: 123,
                    height: 196
                },
                id26: {
                    x: 569,
                    y: 217,
                    width: 123,
                    height: 196
                },
                id27: {
                    x: 819,
                    y: 198,
                    width: 123,
                    height: 196
                },
                id28: {
                    x: 955,
                    y: 622,
                    width: 67,
                    height: 104
                },
                id29: {
                    x: 1013,
                    y: 106,
                    width: 67,
                    height: 104
                },
                id3: {
                    x: 0,
                    y: 993,
                    width: 127,
                    height: 24
                },
                id30: {
                    x: 831,
                    y: 792,
                    width: 67,
                    height: 104
                },
                id31: {
                    x: 900,
                    y: 898,
                    width: 67,
                    height: 104
                },
                id32: {
                    x: 969,
                    y: 834,
                    width: 67,
                    height: 104
                },
                id33: {
                    x: 967,
                    y: 0,
                    width: 67,
                    height: 104
                },
                id34: {
                    x: 969,
                    y: 940,
                    width: 67,
                    height: 104
                },
                id35: {
                    x: 831,
                    y: 898,
                    width: 67,
                    height: 104
                },
                id36: {
                    x: 955,
                    y: 410,
                    width: 67,
                    height: 104
                },
                id37: {
                    x: 955,
                    y: 516,
                    width: 67,
                    height: 104
                },
                id38: {
                    x: 955,
                    y: 304,
                    width: 67,
                    height: 104
                },
                id39: {
                    x: 944,
                    y: 198,
                    width: 67,
                    height: 104
                },
                id4: {
                    x: 88,
                    y: 1019,
                    width: 39,
                    height: 40
                },
                id40: {
                    x: 900,
                    y: 792,
                    width: 67,
                    height: 104
                },
                id41: {
                    x: 443,
                    y: 634,
                    width: 67,
                    height: 104
                },
                id42: {
                    x: 0,
                    y: 454,
                    width: 150,
                    height: 186
                },
                id43: {
                    x: 154,
                    y: 274,
                    width: 145,
                    height: 177
                },
                id44: {
                    x: 152,
                    y: 454,
                    width: 145,
                    height: 175
                },
                id45: {
                    x: 298,
                    y: 631,
                    width: 143,
                    height: 178
                },
                id46: {
                    x: 0,
                    y: 274,
                    width: 152,
                    height: 178
                },
                id47: {
                    x: 299,
                    y: 454,
                    width: 139,
                    height: 172
                },
                id48: {
                    x: 152,
                    y: 631,
                    width: 141,
                    height: 175
                },
                id49: {
                    x: 298,
                    y: 811,
                    width: 141,
                    height: 180
                },
                id5: {
                    x: 45,
                    y: 1019,
                    width: 41,
                    height: 42
                },
                id50: {
                    x: 149,
                    y: 809,
                    width: 147,
                    height: 171
                },
                id51: {
                    x: 441,
                    y: 811,
                    width: 138,
                    height: 179
                },
                id52: {
                    x: 0,
                    y: 642,
                    width: 149,
                    height: 165
                },
                id53: {
                    x: 443,
                    y: 454,
                    width: 135,
                    height: 178
                },
                id54: {
                    x: 0,
                    y: 809,
                    width: 147,
                    height: 172
                },
                id55: {
                    x: 434,
                    y: 30,
                    width: 141,
                    height: 185
                },
                id56: {
                    x: 301,
                    y: 274,
                    width: 141,
                    height: 178
                },
                id57: {
                    x: 444,
                    y: 217,
                    width: 123,
                    height: 196
                },
                id58: {
                    x: 969,
                    y: 728,
                    width: 67,
                    height: 104
                },
                id6: {
                    x: 0,
                    y: 1019,
                    width: 43,
                    height: 43
                },
                id7: {
                    x: 967,
                    y: 152,
                    width: 43,
                    height: 44
                },
                id8: {
                    x: 967,
                    y: 106,
                    width: 44,
                    height: 44
                },
                id9: {
                    x: 0,
                    y: 263,
                    width: 404,
                    height: 9
                }
            }
        }, 
        {
            id: "uiElements",
            file: "images/uiElements.png",
            oAtlasData: {
                id0: {
                    x: 1743,
                    y: 1021,
                    width: 122,
                    height: 121
                },
                id1: {
                    x: 0,
                    y: 0,
                    width: 750,
                    height: 250
                },
                id10: {
                    x: 1522,
                    y: 632,
                    width: 214,
                    height: 306
                },
                id11: {
                    x: 1592,
                    y: 0,
                    width: 213,
                    height: 208
                },
                id12: {
                    x: 1807,
                    y: 0,
                    width: 123,
                    height: 235
                },
                id13: {
                    x: 955,
                    y: 1812,
                    width: 181,
                    height: 75
                },
                id14: {
                    x: 0,
                    y: 483,
                    width: 750,
                    height: 184
                },
                id15: {
                    x: 0,
                    y: 855,
                    width: 749,
                    height: 173
                },
                id16: {
                    x: 1058,
                    y: 537,
                    width: 254,
                    height: 206
                },
                id17: {
                    x: 1355,
                    y: 212,
                    width: 243,
                    height: 209
                },
                id18: {
                    x: 553,
                    y: 1463,
                    width: 384,
                    height: 208
                },
                id19: {
                    x: 1243,
                    y: 1251,
                    width: 250,
                    height: 206
                },
                id2: {
                    x: 553,
                    y: 1885,
                    width: 216,
                    height: 73
                },
                id20: {
                    x: 1240,
                    y: 1036,
                    width: 277,
                    height: 213
                },
                id21: {
                    x: 752,
                    y: 746,
                    width: 217,
                    height: 212
                },
                id22: {
                    x: 1363,
                    y: 0,
                    width: 227,
                    height: 210
                },
                id23: {
                    x: 1600,
                    y: 210,
                    width: 205,
                    height: 210
                },
                id24: {
                    x: 1519,
                    y: 991,
                    width: 222,
                    height: 211
                },
                id25: {
                    x: 1071,
                    y: 324,
                    width: 282,
                    height: 211
                },
                id26: {
                    x: 1355,
                    y: 423,
                    width: 241,
                    height: 207
                },
                id27: {
                    x: 752,
                    y: 536,
                    width: 304,
                    height: 208
                },
                id28: {
                    x: 553,
                    y: 1673,
                    width: 356,
                    height: 210
                },
                id29: {
                    x: 621,
                    y: 1242,
                    width: 323,
                    height: 211
                },
                id3: {
                    x: 1084,
                    y: 212,
                    width: 153,
                    height: 92
                },
                id30: {
                    x: 1042,
                    y: 1889,
                    width: 70,
                    height: 75
                },
                id31: {
                    x: 1489,
                    y: 1769,
                    width: 140,
                    height: 175
                },
                id32: {
                    x: 0,
                    y: 1933,
                    width: 77,
                    height: 24
                },
                id33: {
                    x: 79,
                    y: 1933,
                    width: 71,
                    height: 18
                },
                id34: {
                    x: 0,
                    y: 438,
                    width: 750,
                    height: 43
                },
                id35: {
                    x: 1742,
                    y: 1204,
                    width: 124,
                    height: 104
                },
                id36: {
                    x: 1860,
                    y: 1310,
                    width: 106,
                    height: 96
                },
                id37: {
                    x: 1138,
                    y: 1812,
                    width: 98,
                    height: 100
                },
                id38: {
                    x: 1867,
                    y: 1021,
                    width: 94,
                    height: 102
                },
                id39: {
                    x: 1314,
                    y: 632,
                    width: 148,
                    height: 100
                },
                id4: {
                    x: 1738,
                    y: 654,
                    width: 134,
                    height: 135
                },
                id40: {
                    x: 974,
                    y: 1036,
                    width: 176,
                    height: 96
                },
                id41: {
                    x: 1738,
                    y: 791,
                    width: 128,
                    height: 100
                },
                id42: {
                    x: 974,
                    y: 1134,
                    width: 160,
                    height: 96
                },
                id43: {
                    x: 1239,
                    y: 212,
                    width: 112,
                    height: 98
                },
                id44: {
                    x: 1807,
                    y: 237,
                    width: 108,
                    height: 98
                },
                id45: {
                    x: 1868,
                    y: 1125,
                    width: 91,
                    height: 100
                },
                id46: {
                    x: 1136,
                    y: 1134,
                    width: 102,
                    height: 98
                },
                id47: {
                    x: 1598,
                    y: 423,
                    width: 138,
                    height: 94
                },
                id48: {
                    x: 1742,
                    y: 1310,
                    width: 116,
                    height: 102
                },
                id49: {
                    x: 955,
                    y: 1889,
                    width: 85,
                    height: 75
                },
                id5: {
                    x: 1243,
                    y: 1459,
                    width: 245,
                    height: 244
                },
                id50: {
                    x: 0,
                    y: 1030,
                    width: 619,
                    height: 105
                },
                id51: {
                    x: 0,
                    y: 1355,
                    width: 619,
                    height: 106
                },
                id52: {
                    x: 0,
                    y: 669,
                    width: 750,
                    height: 184
                },
                id53: {
                    x: 0,
                    y: 252,
                    width: 750,
                    height: 184
                },
                id54: {
                    x: 0,
                    y: 1137,
                    width: 619,
                    height: 107
                },
                id55: {
                    x: 0,
                    y: 1246,
                    width: 619,
                    height: 107
                },
                id56: {
                    x: 1243,
                    y: 1705,
                    width: 244,
                    height: 244
                },
                id57: {
                    x: 771,
                    y: 1885,
                    width: 182,
                    height: 75
                },
                id58: {
                    x: 0,
                    y: 1463,
                    width: 551,
                    height: 468
                },
                id59: {
                    x: 1276,
                    y: 745,
                    width: 244,
                    height: 244
                },
                id6: {
                    x: 939,
                    y: 1455,
                    width: 302,
                    height: 355
                },
                id60: {
                    x: 1718,
                    y: 1681,
                    width: 199,
                    height: 209
                },
                id61: {
                    x: 621,
                    y: 1030,
                    width: 351,
                    height: 210
                },
                id62: {
                    x: 1519,
                    y: 1204,
                    width: 221,
                    height: 209
                },
                id63: {
                    x: 752,
                    y: 324,
                    width: 317,
                    height: 210
                },
                id64: {
                    x: 1084,
                    y: 0,
                    width: 277,
                    height: 210
                },
                id65: {
                    x: 1490,
                    y: 1459,
                    width: 226,
                    height: 308
                },
                id66: {
                    x: 1738,
                    y: 422,
                    width: 170,
                    height: 230
                },
                id67: {
                    x: 752,
                    y: 0,
                    width: 330,
                    height: 322
                },
                id68: {
                    x: 946,
                    y: 1242,
                    width: 292,
                    height: 205
                },
                id69: {
                    x: 1598,
                    y: 519,
                    width: 132,
                    height: 95
                },
                id7: {
                    x: 1743,
                    y: 893,
                    width: 123,
                    height: 126
                },
                id8: {
                    x: 974,
                    y: 746,
                    width: 300,
                    height: 288
                },
                id9: {
                    x: 1718,
                    y: 1415,
                    width: 204,
                    height: 264
                }
            }
        }, 
        {
            id: "gameThemes",
            file: "images/gameThemes.png",
            oAtlasData: {
                id0: {
                    x: 0,
                    y: 944,
                    width: 590,
                    height: 234
                },
                id1: {
                    x: 592,
                    y: 1145,
                    width: 526,
                    height: 300
                },
                id10: {
                    x: 0,
                    y: 1180,
                    width: 590,
                    height: 237
                },
                id11: {
                    x: 1120,
                    y: 238,
                    width: 525,
                    height: 301
                },
                id12: {
                    x: 0,
                    y: 708,
                    width: 590,
                    height: 234
                },
                id13: {
                    x: 1120,
                    y: 541,
                    width: 525,
                    height: 301
                },
                id14: {
                    x: 0,
                    y: 236,
                    width: 590,
                    height: 234
                },
                id15: {
                    x: 1120,
                    y: 1147,
                    width: 525,
                    height: 301
                },
                id2: {
                    x: 0,
                    y: 472,
                    width: 590,
                    height: 234
                },
                id3: {
                    x: 592,
                    y: 541,
                    width: 526,
                    height: 300
                },
                id4: {
                    x: 592,
                    y: 0,
                    width: 590,
                    height: 236
                },
                id5: {
                    x: 592,
                    y: 843,
                    width: 526,
                    height: 300
                },
                id6: {
                    x: 0,
                    y: 1419,
                    width: 590,
                    height: 234
                },
                id7: {
                    x: 592,
                    y: 238,
                    width: 526,
                    height: 301
                },
                id8: {
                    x: 0,
                    y: 0,
                    width: 590,
                    height: 234
                },
                id9: {
                    x: 1120,
                    y: 844,
                    width: 525,
                    height: 301
                }
            }
        }, 
        {
            id: "gameBgs",
            file: "images/gameBgs.jpg",
            oAtlasData: {
                id0: {
                    x: 0,
                    y: 606,
                    width: 1000,
                    height: 200
                },
                id1: {
                    x: 0,
                    y: 1212,
                    width: 1000,
                    height: 200
                },
                id2: {
                    x: 0,
                    y: 1010,
                    width: 1000,
                    height: 200
                },
                id3: {
                    x: 0,
                    y: 808,
                    width: 1000,
                    height: 200
                },
                id4: {
                    x: 0,
                    y: 1414,
                    width: 1000,
                    height: 200
                },
                id5: {
                    x: 0,
                    y: 404,
                    width: 1000,
                    height: 200
                },
                id6: {
                    x: 0,
                    y: 202,
                    width: 1000,
                    height: 200
                },
                id7: {
                    x: 0,
                    y: 0,
                    width: 1000,
                    height: 200
                }
            }
        }, 
        {
            id: "firework",
            file: "images/firework_175x175.png",
            oAnims: {
                explode: [
                    0, 
                    1, 
                    2, 
                    3, 
                    4, 
                    5, 
                    6, 
                    7, 
                    8, 
                    9, 
                    10, 
                    11, 
                    12, 
                    13, 
                    14, 
                    15, 
                    16, 
                    17, 
                    18, 
                    19, 
                    20, 
                    21, 
                    22, 
                    23, 
                    24, 
                    25, 
                    26, 
                    27, 
                    28, 
                    29
                ]
            }
        }, 
        {
            id: "shadow",
            file: "images/shadow.png"
        }, 
        {
            id: "rotateIcon",
            file: "images/rotate.png"
        }, 
        {
            id: "langText",
            file: "json/text.json"
        }, 
        {
            id: "titleLogo",
            file: "images/title/title_" + curLang + ".png"
        }, 
        {
            id: "titleLogoWhite",
            file: "images/title/title_white_" + curLang + ".png"
        }, 
        {
            id: "info",
            file: "images/info.png"
        }, 
        {
            id: "fadeBg",
            file: "images/fadeBg.jpg"
        }
    ], ctx, canvas.width, canvas.height);
    oImageIds.net = "id0";
    oImageIds.ball = "id1";
    oImageIds.ballShadow = "id2";
    oImageIds.batShadow = "id3";
    oImageIds.ballTrail4 = "id4";
    oImageIds.ballTrail3 = "id5";
    oImageIds.ballTrail2 = "id6";
    oImageIds.ballTrail1 = "id7";
    oImageIds.ballTrail0 = "id8";
    oImageIds.tableClip = "id9";
    oImageIds.tableEdge = "id10";
    oImageIds.tableLegs = "id11";
    oImageIds.finger = "id12";
    oImageIds.bounceMark = "id13";
    oImageIds.bat0 = "id14";
    oImageIds.bat1 = "id15";
    oImageIds.bat2 = "id16";
    oImageIds.bat3 = "id17";
    oImageIds.bat4 = "id18";
    oImageIds.bat5 = "id19";
    oImageIds.bat6 = "id20";
    oImageIds.bat7 = "id21";
    oImageIds.bat8 = "id22";
    oImageIds.bat9 = "id23";
    oImageIds.bat10 = "id24";
    oImageIds.bat11 = "id25";
    oImageIds.bat12 = "id26";
    oImageIds.bat13 = "id27";
    oImageIds.opBat0 = "id28";
    oImageIds.opBat1 = "id29";
    oImageIds.opBat2 = "id30";
    oImageIds.opBat3 = "id31";
    oImageIds.opBat4 = "id32";
    oImageIds.opBat5 = "id33";
    oImageIds.opBat6 = "id34";
    oImageIds.opBat7 = "id35";
    oImageIds.opBat8 = "id36";
    oImageIds.opBat9 = "id37";
    oImageIds.opBat10 = "id38";
    oImageIds.opBat11 = "id39";
    oImageIds.opBat12 = "id40";
    oImageIds.opBat13 = "id41";
    oImageIds.gameChar0 = "id42";
    oImageIds.gameChar1 = "id43";
    oImageIds.gameChar2 = "id44";
    oImageIds.gameChar3 = "id45";
    oImageIds.gameChar4 = "id46";
    oImageIds.gameChar5 = "id47";
    oImageIds.gameChar6 = "id48";
    oImageIds.gameChar7 = "id49";
    oImageIds.gameChar8 = "id50";
    oImageIds.gameChar9 = "id51";
    oImageIds.gameChar10 = "id52";
    oImageIds.gameChar11 = "id53";
    oImageIds.gameChar12 = "id54";
    oImageIds.gameChar13 = "id55";
    oImageIds.gameChar14 = "id56";
    oImageIds.bat14 = "id57";
    oImageIds.opBat14 = "id58";
    if(charLineUp == 0) {
        oImageIds.gameChar6 = "id56";
        oImageIds.bat6 = "id57";
        oImageIds.opBat6 = "id58";
    }
    oImageIds.table0 = "id0";
    oImageIds.tableBgBottom0 = "id1";
    oImageIds.table1 = "id2";
    oImageIds.tableBgBottom1 = "id3";
    oImageIds.table2 = "id4";
    oImageIds.tableBgBottom2 = "id5";
    oImageIds.table3 = "id6";
    oImageIds.tableBgBottom3 = "id7";
    oImageIds.table4 = "id8";
    oImageIds.tableBgBottom4 = "id9";
    oImageIds.table5 = "id10";
    oImageIds.tableBgBottom5 = "id11";
    oImageIds.table6 = "id12";
    oImageIds.tableBgBottom6 = "id13";
    oImageIds.table7 = "id14";
    oImageIds.tableBgBottom7 = "id15";
    if(charLineUp == 0) {
        oImageIds.table6 = "id0";
        oImageIds.tableBgBottom6 = "id1";
    }
    oImageIds.tableBg0 = "id0";
    oImageIds.tableBg1 = "id1";
    oImageIds.tableBg2 = "id2";
    oImageIds.tableBg3 = "id3";
    oImageIds.tableBg4 = "id4";
    oImageIds.tableBg5 = "id5";
    oImageIds.tableBg6 = "id6";
    oImageIds.tableBg7 = "id7";
    if(charLineUp == 0) {
        oImageIds.tableBg6 = "id0";
    }
    oImageIds.tournament0But = "id0";
    oImageIds.tournament0ButOver = "id1";
    oImageIds.quickGameBut = "id2";
    oImageIds.quickGameButOver = "id3";
    oImageIds.muteBut0 = "id4";
    oImageIds.muteBut0Over = "id5";
    oImageIds.muteBut1 = "id6";
    oImageIds.muteBut1Over = "id7";
    oImageIds.infoBut = "id8";
    oImageIds.infoButOver = "id9";
    oImageIds.backBut = "id10";
    oImageIds.backButOver = "id11";
    oImageIds.playBut = "id12";
    oImageIds.playButOver = "id13";
    oImageIds.resetBut = "id14";
    oImageIds.resetButOver = "id15";
    oImageIds.charBut0 = "id16";
    oImageIds.charBut0Over = "id17";
    oImageIds.charBut1 = "id18";
    oImageIds.charBut1Over = "id19";
    oImageIds.charBut4 = "id20";
    oImageIds.charBut4Over = "id21";
    oImageIds.charBut5 = "id22";
    oImageIds.charBut5Over = "id23";
    oImageIds.charBut8 = "id24";
    oImageIds.charBut8Over = "id25";
    oImageIds.charBut7 = "id26";
    oImageIds.charBut7Over = "id27";
    oImageIds.charBut12 = "id28";
    oImageIds.charBut12Over = "id29";
    oImageIds.charBut2 = "id30";
    oImageIds.charBut2Over = "id31";
    oImageIds.charBut9 = "id32";
    oImageIds.charBut9Over = "id33";
    oImageIds.charBut11 = "id34";
    oImageIds.charBut11Over = "id35";
    oImageIds.charBut3 = "id36";
    oImageIds.charBut3Over = "id37";
    oImageIds.charBut13 = "id38";
    oImageIds.charBut13Over = "id39";
    oImageIds.charBut6 = "id40";
    oImageIds.charBut6Over = "id41";
    oImageIds.charBut10 = "id42";
    oImageIds.charBut10Over = "id43";
    oImageIds.charButLocked = "id44";
    oImageIds.replayBut = "id45";
    oImageIds.replayButOver = "id46";
    oImageIds.pauseBut = "id47";
    oImageIds.pauseButOver = "id48";
    oImageIds.tickBut = "id49";
    oImageIds.tickButOver = "id50";
    oImageIds.resetBut = "id51";
    oImageIds.resetButOver = "id52";
    oImageIds.quitBut = "id53";
    oImageIds.quitButOver = "id54";
    oImageIds.charBut14 = "id55";
    oImageIds.charBut14Over = "id56";
    oImageIds.tournament1But = "id57";
    oImageIds.tournament1ButOver = "id58";
    if(charLineUp == 0) {
        oImageIds.charBut6 = "id55";
        oImageIds.charBut6Over = "id56";
    }
    oImageIds.bgBat = "id0";
    oImageIds.titleBarsBg = "id1";
    oImageIds.titleRibbon = "id2";
    oImageIds.cnLogo = "id3";
    oImageIds.titleChar4 = "id4";
    oImageIds.titleChar6 = "id5";
    oImageIds.titleChar2 = "id6";
    oImageIds.titleChar3 = "id7";
    oImageIds.titleChar0 = "id8";
    oImageIds.titleChar1 = "id9";
    oImageIds.titleChar7 = "id10";
    oImageIds.titleChar8 = "id11";
    oImageIds.titleChar5 = "id12";
    oImageIds.selectPrompt0 = "id13";
    oImageIds.flameBarsBg = "id14";
    oImageIds.selectBlueBg = "id15";
    oImageIds.zoomChar0 = "id16";
    oImageIds.zoomChar7 = "id17";
    oImageIds.zoomChar2 = "id18";
    oImageIds.zoomChar8 = "id19";
    oImageIds.zoomChar4 = "id20";
    oImageIds.zoomChar5 = "id21";
    oImageIds.zoomChar11 = "id22";
    oImageIds.zoomChar9 = "id23";
    oImageIds.zoomChar3 = "id24";
    oImageIds.zoomChar13 = "id25";
    oImageIds.zoomChar1 = "id26";
    oImageIds.zoomChar6 = "id27";
    oImageIds.zoomChar10 = "id28";
    oImageIds.zoomChar12 = "id29";
    oImageIds.vs = "id30";
    oImageIds.statsPanel = "id31";
    oImageIds.statsBarBg = "id32";
    oImageIds.statsBar = "id33";
    oImageIds.blueBarBg = "id34";
    oImageIds.silChar4 = "id35";
    oImageIds.silChar1 = "id36";
    oImageIds.silChar3 = "id37";
    oImageIds.silChar5 = "id38";
    oImageIds.silChar12 = "id39";
    oImageIds.silChar2 = "id40";
    oImageIds.silChar13 = "id41";
    oImageIds.silChar10 = "id42";
    oImageIds.silChar8 = "id43";
    oImageIds.silChar7 = "id44";
    oImageIds.silChar9 = "id45";
    oImageIds.silChar11 = "id46";
    oImageIds.silChar6 = "id47";
    oImageIds.silChar0 = "id48";
    oImageIds.cross = "id49";
    oImageIds.preMatchConvRight0 = "id50";
    oImageIds.preMatchConvLeft1 = "id51";
    oImageIds.winBarsBg = "id52";
    oImageIds.loseBarsBg = "id53";
    oImageIds.preMatchConvLeft0 = "id54";
    oImageIds.preMatchConvRight1 = "id55";
    oImageIds.flare1 = "id56";
    oImageIds.selectPrompt1 = "id57";
    oImageIds.tutScreen = "id58";
    oImageIds.flare0 = "id59";
    oImageIds.zoomChar109 = "id60";
    oImageIds.zoomChar110 = "id61";
    oImageIds.zoomChar111 = "id62";
    oImageIds.zoomChar112 = "id63";
    oImageIds.zoomChar113 = "id64";
    oImageIds.winCup1 = "id65";
    oImageIds.winCup0 = "id66";
    oImageIds.titleChar14 = "id67";
    oImageIds.zoomChar14 = "id68";
    oImageIds.silChar14 = "id69";
    if(charLineUp == 0) {
        oImageIds.titleChar6 = "id67";
        oImageIds.zoomChar6 = "id68";
        oImageIds.silChar6 = "id69";
    }
    assetLib.onReady(initSplash);
    gameState = "load";
    previousTime = new Date().getTime();
    updateLoaderEvent();
}
function resizeCanvas() {
    var tempInnerWidth = window.innerWidth;
    var tempInnerHeight = window.innerHeight;
    canvas.height = tempInnerHeight;
    canvas.width = tempInnerWidth;
    canvas.style.width = tempInnerWidth + "px";
    canvas.style.height = tempInnerHeight + "px";
    var maxW;
    var maxH;
    var minW;
    var minH;
    canvasScale = 1;
    if(tempInnerWidth > tempInnerHeight) {
        if(isRotated) {
            if(gameState != "loading") {
                initBackFromRotate();
            }
        }
        maxW = maxWidth;
        maxH = maxHeight;
        minW = minWidth;
        minH = minHeight;
    } else {
        if(!isRotated) {
            if(gameState != "loading") {
                initRotateWarning();
            }
        }
        maxW = maxHeight;
        maxH = maxWidth;
        minW = minHeight;
        minH = minWidth;
    }
    if(canvas.width < maxW || canvas.height < maxH) {
        if(canvas.height < minH) {
            canvas.height = minH;
            canvas.width = minH * (tempInnerWidth / tempInnerHeight);
            canvasScale = minH / tempInnerHeight;
        }
        if(canvas.width < minW) {
            canvas.width = minW;
            canvas.height = minW * (tempInnerHeight / tempInnerWidth);
            canvasScale = minW / tempInnerWidth;
        }
    } else {
        if(canvas.height - maxH < canvas.width - maxW) {
            if(canvas.height < maxH) {
                canvasScale = 1;
            } else {
                canvas.height = maxH;
                canvas.width = maxH * (tempInnerWidth / tempInnerHeight);
                canvasScale = maxH / tempInnerHeight;
            }
        } else {
            if(canvas.width < maxW) {
                canvasScale = 1;
            } else {
                canvas.width = maxW;
                canvas.height = maxW * (tempInnerHeight / tempInnerWidth);
                canvasScale = maxW / tempInnerWidth;
            }
        }
    }
    switch(gameState) {
        case "game":
            if(isMobile) {
                userInput.addHitArea("gameTouch", butEventHandler, {
                    isDraggable: true,
                    multiTouch: true
                }, "rect", {
                    aRect: [
                        0, 
                        50, 
                        canvas.width, 
                        canvas.height
                    ]
                }, true);
            }
            break;
        case "start":
        case "credits":
        case "charSelect":
        case "progress":
        case "gameIntro":
        case "pause":
        case "tournamentWin":
        case "gameComplete":
            if(this.prevCanvasWidth != tempInnerWidth && this.prevCanvasHeight != tempInnerHeight) {
                background.resetBgBatSpacing();
            }
            break;
    }
    this.prevCanvasWidth = tempInnerWidth;
    this.prevCanvasHeight = tempInnerHeight;
    window.scrollTo(0, 0);
}
function initRotateWarning() {
    isRotated = true;
    prevGameState = gameState;
    gameState = "rotated";
    background = new Elements.Background();
    previousTime = new Date().getTime();
    resizeCanvas();
    updateRotateWarningEvent();
}
function initBackFromRotate() {
    isRotated = false;
    switch(prevGameState) {
        case "start":
            gameState = "start";
            previousTime = new Date().getTime();
            updateStartScreenEvent();
            break;
        case "start":
            gameState = "game";
            previousTime = new Date().getTime();
            updateGameEvent();
        case "pause":
            gameState = "pause";
            previousTime = new Date().getTime();
            updatePauseEvent();
            break;
        case "credits":
            gameState = "credits";
            previousTime = new Date().getTime();
            updateCreditsScreenEvent();
            break;
        case "charSelect":
            gameState = "charSelect";
            previousTime = new Date().getTime();
            updateCharSelectScreenEvent();
            break;
        case "progress":
            gameState = "progress";
            previousTime = new Date().getTime();
            updateCharSelectScreenEvent();
            break;
        case "gameIntro":
            gameState = "gameIntro";
            previousTime = new Date().getTime();
            updateGameIntroScreenEvent();
            break;
        case "gameComplete":
            gameState = "gameComplete";
            previousTime = new Date().getTime();
            updateGameComplete();
            break;
        case "game":
            gameState = "game";
            previousTime = new Date().getTime();
            updateGameEvent();
            break;
        case "tournamentWin":
            gameState = "tournamentWin";
            previousTime = new Date().getTime();
            updateGameEvent();
            break;
    }
}
function playSound(_id) {
    if(audioType == 1) {
        sound.play(_id);
    }
}
function toggleMute() {
    muted = !muted;
    if(audioType == 1) {
        if(muted) {
            Howler.mute(true);
            music.pause();
        } else {
            Howler.mute(false);
            playMusic();
            if(gameState == "game") {
                music.volume(.18);
            } else {
                music.volume(.3);
            }
        }
    } else if(audioType == 2) {
        if(muted) {
            music.pause();
        } else {
            playMusic();
        }
    }
}
