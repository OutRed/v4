var brainpop = {
	enabled: true,
	endpoint: "https://www.brainpop.com",
	//endpoint: "https://secure.brainpop.com",
	playerId: "",
	playerType: "",
	saveId: "",
	gameId: "",
	timestamp: "",
	saveData64: "",
	currentRequest: null,

	init: function (gameID) {
		this.gameId = gameID;
		SendMessage("BrainpopConnector", "Init_Success", (this.enabled) ? "true" : "false");
	},
	
	login: function () {
	    if (!this.enabled) {
	        console.log("[Brainpop] not enabled");
	        SendMessage("BrainpopConnector", "Login_Failure", "");
			return;
		}
		console.log("[Brainpop] attempting login...");
		this.sendRequest("GET", "/api/players/logged-in", this.onLogin.bind(this));
	},
	
	enableSnapthought: function() {
		if (!this.enabled || this.playerId == "") {
	        console.log("[Brainpop] not enabled or saveid is not defined");
			return;
		}
		
		if (window.captureReady) {
			window.captureReady();
		}
	},

	onLogin: function (e) {
		console.log("[Brainpop] onLogin");
		this.handleRequestError();
		if (this.currentRequest.readyState == 4) {
		    if (this.currentRequest.status == 200) {
		        if (!this.currentRequest.response.EntryID || this.currentRequest.response.EntryID == "" || this.currentRequest.response.has_product_access == "no") {
		            console.log("[Brainpop] student not logged in!");
		            SendMessage("BrainpopConnector", "Login_Failure", "");
		        } else {
		            console.log("[Brainpop] student logged in!");
		            this.playerId = this.currentRequest.response.EntryID;
		            this.playerType = this.currentRequest.response.player_type;

		            console.log("[Brainpop] playerId = " + this.playerId);
		            console.log("[Brainpop] playerType = " + this.playerType);

		            SendMessage("BrainpopConnector", "Login_Success", this.playerId.toString());
		        }
		    } else {
		        SendMessage("BrainpopConnector", "Login_Failure", "");
		    }
		}
	},

	getSaves: function () {
	    if (!this.enabled || this.playerId == "") {
	        console.log("[Brainpop] not enabled or saveid is not defined");
	        SendMessage("BrainpopConnector", "GetSaves_Failure", "");
			return;
		}
		console.log("[Brainpop] getSaves");
		this.sendRequest("GET", "/api/players-game-sessions?player_id=" + this.playerId + "&player_type=" + this.playerType + "&game_id=" + this.gameId, this.onGetSaves.bind(this));
	},

	onGetSaves: function (e) {
		console.log("[Brainpop] onGetSaves");
		this.handleRequestError();
		if (this.currentRequest.readyState == 4) {
		    if (this.currentRequest.status == 200) {
				// We need to be able to distinguish between an error and no save
				if (this.currentRequest.response.error != null) {
					console.log("[Brainpop] saved session not found with error: " + currentRequest.response.error);
					SendMessage("BrainpopConnector", "GetSaves_Failure", "");
				} else if (this.currentRequest.response.length == 0) {
		            console.log("[Brainpop] saved session not found");
		            SendMessage("BrainpopConnector", "GetSaves_Success", "");
		        } else {
		            //[{"EntryID":"1lSemSpiWL8_","d_last_updated":"UNIX EPOC TIMESTAMP","data":"BASE64ENCODEDSESSIONDATA"}]
		            console.log("[Brainpop] saved session found!");

		            for (var i = 0; i < this.currentRequest.response.length; ++i) {
		                if (this.currentRequest.response[i].EntryID != "")
		                    this.saveId = this.currentRequest.response[i].EntryID;
		                if (this.currentRequest.response[i].d_last_updated != "")
		                    this.timestamp = this.currentRequest.response[i].d_last_updated;
		                if (this.currentRequest.response[i].data != "")
		                    this.saveData64 = this.currentRequest.response[i].data;
		            }
		            console.log("[Brainpop] saveId = " + this.saveId);
		            console.log("[Brainpop] timestamp = " + this.timestamp);
		            console.log("[Brainpop] saveData64 = " + this.saveData64);

		            var decodedStr = window.atob(this.saveData64);
		            console.log("[Brainpop] jsonStr loaded: " + decodedStr);
		            SendMessage("BrainpopConnector", "GetSaves_Success", decodedStr);
		        }
		    } else {
		        SendMessage("BrainpopConnector", "GetSaves_Failure", "");
		    }
		}
	},

	save: function (saveString) {
	    if (!this.enabled || this.saveId == "") {
	        console.log("[Brainpop] not enabled or saveid is not defined");
	        SendMessage("BrainpopConnector", "Save_Failure", "");
			return;
		}
		console.log("[Brainpop] save");
		this.saveData64 = window.btoa(saveString);
		this.sendRequest("POST", "/api/players-game-sessions/" + this.saveId, this.onSave.bind(this), "id=" + this.saveId + "&data=" + this.saveData64);
	},

	onSave: function (e) {
		console.log("[Brainpop] onSave");
		this.handleRequestError();
		if (this.currentRequest.readyState == 4) {
		    if (this.currentRequest.status == 200) {
		        // {"EntryID":"1lSemSpiWL8_"}
		        console.log("[Brainpop] session saved!");
		        //this.saveId = this.currentRequest.response.EntryID;
		        //console.log("[Brainpop] saveId = " + this.saveId);
		        SendMessage("BrainpopConnector", "Save_Success", "");
		    } else {
		        SendMessage("BrainpopConnector", "Save_Failure", "");
		    }
		}
	},

	newGame: function (saveString) {
	    if (!this.enabled/* || this.saveId == ""*/) {
	        console.log("[Brainpop] not enabled");
	        SendMessage("BrainpopConnector", "NewGame_Failure", "");
			return;
		}
		console.log("[Brainpop] newGame");
		this.saveData64 = window.btoa(saveString);
		this.sendRequest("POST", "/api/players-game-sessions", this.onNewGame.bind(this), "game_id=" + this.gameId + "&data=" + this.saveData64);
	},

	onNewGame: function (e) {
	    console.log("[Brainpop] onNewGame");
	    this.handleRequestError();
	    if (this.currentRequest.readyState == 4) {
	        if (this.currentRequest.status == 200) {
	            // {"EntryID":"1lSemSpiWL8_"}
	            console.log("[Brainpop] new game session!");
	            this.saveId = this.currentRequest.response.EntryID;
	            console.log("[Brainpop] saveId = " + this.saveId);
	            SendMessage("BrainpopConnector", "NewGame_Success", "");
	        } else {
	            SendMessage("BrainpopConnector", "NewGame_Failure", "");
	        }
	    }
	},

	sendRequest: function (method, url, callback, postData) {
		console.log("[Brainpop] sendRequest");
		if (this.currentRequest != null) {
			this.currentRequest.onreadystatechange = null;
		}
		this.currentRequest = new XMLHttpRequest();
		this.currentRequest.withCredentials = true;
		this.currentRequest.responseType = "json";// set xhr.responseType = 'json'; as opposed to JSON.parse. You can then get xhr.response instead of responseText
		this.currentRequest.open(method, this.endpoint + url, true);
		
		this.currentRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		
		if (postData != undefined && postData != "") {
			this.currentRequest.send(postData);
		} else
			this.currentRequest.send();
		
		this.currentRequest.onreadystatechange = callback;
	},

	handleRequestError: function () {
		if (this.currentRequest.readyState == 4 && this.currentRequest.status == 400) {
			console.log(this.currentRequest.response.error);
		}
	}
}