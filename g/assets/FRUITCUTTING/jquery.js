var playing = false;
var score;
var trials;
var step;
var action;
var fruits = ['apple','banana','cherries','grapes','greenapple','mango','orange','pear','pineapple','watermelon'];
$(function(){
	$("#startreset").click(function(){
		if (playing == true) {
			location.reload();
		}
		else {
			playing = true;
			score = 0;
			$("#scorevalue").html(score);
			$("#gameOver").hide();
			$("#trialsLeft").show();
			trials = 3;
			addlife();
			$("#startreset").html("Reset Game");
			startGame();

		}
	});

	function startGame(){
		$("#fruit1").show();
		choosefruit();
		$("#fruit1").css({'left':Math.round(Math.random()*550+50), 'top' : -50});
		step = 1+Math.round(Math.random()*5);
		action = setInterval(function(){
			$("#fruit1").css('top', $("#fruit1").position().top + step);
			if ($("#fruit1").position().top > $("#fruitsContainer").height()) {
				if (trials>1) {
					$("#fruit1").show();
					choosefruit();
					$("#fruit1").css({'left':Math.round(Math.random()*550+50), 'top' : -50});
					step = 1+Math.round(Math.random()*4);
					trials--;
					addlife();
				}
				else {
					playing = false;
					$("#startreset").html("Start Game");
					$("#trialsLeft").hide();
					$("#gameOver").show();
					$("#gameOver").html("<br>GAME OVER!<br>YOUR SCORE IS " + score);
					clearInterval(action);
					$("#fruit1").hide();
				}
			}
		},10);

	}
	$("#fruit1").mouseover(function(){
		score++;
		$("#scorevalue").html(score);
		$("#slicesound")[0].play();
		$("#slicesound")[0].playbackRate = 2;
		clearInterval(action);
		// startGame();
		$("#fruit1").hide("explode", 500);
		setTimeout(startGame,600);
	})
	function choosefruit() {
		$("#fruit1").attr('src','images/' +fruits[Math.round(Math.random()*9)]+ '.png');
	}
	function addlife() {
		$("#trialsLeft").empty();
		for(i = 0; i<trials; i++){
			$("#trialsLeft").append('<img src="images/heart.png" class="life">');
		}
	}
});