/**
	 * Example
         * Working example: http://www.gamedistribution.com/Games/Basketball/Basket-and-Ball.html
	 */

   var initialized = false; 
   
   function initGDApi()
   { // invoke this function to initialize api
	   
	if(!initialized){ // Api will be initialized once, so preroll is shown once either
	   
		   var settings = {
            gameId: "14a6a32cd96f4acaa04f5440ffe9a865",
            userId: "ABD36C6C-E74B-4BA7-BE87-0AB01F98D30D-s1",
            resumeGame: resumeGame,
            pauseGame: pauseGame,
            onInit: function (data) {
			   initialized = true;
            },
            onError: function (data) {
               console.log("Error:"+data);
            }
			};
			(function(i,s,o,g,r,a,m){
				i['GameDistribution']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)};i[r].l=1*new Date();a=s.createElement(o);m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a, m);
			})(window, document, 'script', '//html5.api.gamedistribution.com/libs/gd/api.js', 'gdApi');
       
			gdApi(settings);

			function resumeGame() {
				console.log("Resume game");
			}

			function pauseGame() {
				console.log("Pause game");
			}  

	   }
	   
   }

function gdApi_init()
{ 	
   initGDApi(); // in order to initialize api
}

   /**
 * Shows banner, you can use it between levels
 */	

function gdApi_showBanner()
{ 	
	if (initialized)
		gdApi.showBanner(); 
}		

/**
 * GD Logger sends how many times 'PlayGame' is called. If you invoke 'PlayGame' many times, it increases 
 * 'PlayGame' counter and sends this counter value. 
 */		
function gdApi_play()
{ 	
	if (initialized)
		gdApi.play();
}

/**
 * GD Logger sends how many times 'CustomLog' that is called related to given by _key name. If you invoke 
 * 'CustomLog' many times, it increases 'CustomLog' counter and sends this counter value. 
 * @param	key		Your custom key it should be maximum 10 chars
 */		
function gdApi_customLog(_Key)
{ 	
	if (initialized)
		gdApi.customLog(_Key);
}