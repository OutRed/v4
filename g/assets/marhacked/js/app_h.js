var Current_Client_Running_Ver = "2.6"
var serverclic = true
var allowafire = false

Mario.GodMode = function() {
    if(NotGame == false) {
        Mario.MarioCharacter.InvulnerableTime = 999999
        setTimeout(function(){ Mario.GodMode(); }, 500);
    }
}
function changeServerClicOpt() {
    if(serverclic == false) {
        serverclic = true
    }else{
        serverclic = false
    }
}
function changeAllowFireOpt() {
    if(allowafire == false) {
        allowafire = true
    }else{
        allowafire = false
    }
}
function AddHacksOverLay() {
    addedMaL = 0
    addedMaC = 0
    MarioTpe = 1
    allowafire = false
    document.getElementById("HacksMainTitleOverlay").innerHTML = "Hacks Menu:"
    document.getElementById("HacksMainContentOverlay").innerHTML = '<h3>Ground Inertia:</h3><input type="range" min="0.89" max="10" value="0.89" id="grooundInertiaCustom" class="slider"><h3>Air Inertia:</h3><input type="range" min="0.89" max="10" value="0.89" id="airInertiaCustom" class="slider"><h3>Allow Fire:</h3><div class="onoffswitch"><input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="savageAllowFire" tabindex="0" unchecked onclick="changeAllowFireOpt()"><label class="onoffswitch-label" for="savageAllowFire"><span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></label></div><h3>Set Lives:</h3><input type="range" min="1" max="100" value="1" id="addedLives" class="slider"><h3>Set Coins:</h3><input type="range" min="1" max="100" value="1" id="addedCoins" class="slider"><h3>Set Level [Mario Type]:</h3><input type="range" min="1" max="3" value="1" id="MarioType" class="slider"><br><br><input style="border-color: transparent; width: 15%; height: 50px; color: white; background-color: rgb(40, 40, 40); border-radius: 2.5px; font-size: larger; font-family: \'Courier New\', Courier, monospace;" type="button" value="Apply" onclick="ApplyUpdatedHacks()">'
    window.location.href='#HackedClientMenu';
}
function MessageDisplay(msgdistitle, msgdismessage) {
    document.getElementById("msg-title").innerHTML = msgdistitle;
    document.getElementById("msg-content").innerHTML = msgdismessage;
    window.location.href = "#Message";
}
function OutlineMD() {
    window.location.href='main.html?OutlinedMd=' + OutlineMDMode;
}
function ApplySettings() {
    brightness = document.getElementById("briRange").value;
    if(brightness <= 5) {
        document.body.style.backgroundColor = "rgb(20, 20, 20)"
    }if(brightness > 5 && brightness < 10) {
        document.body.style.backgroundColor = "rgb(30, 30, 30)"
    }if(brightness > 10 && brightness < 20) {
        document.body.style.backgroundColor = "rgb(40, 40, 40)"
    }if(brightness > 20 && brightness < 30) {
        document.body.style.backgroundColor = "rgb(50, 50, 50)"
    }if(brightness > 30 && brightness < 40) {
        document.body.style.backgroundColor = "rgb(60, 60, 60)"
    }if(brightness > 40 && brightness < 50) {
        document.body.style.backgroundColor = "rgb(70, 70, 70)"
    }if(brightness == 50) {
        document.body.style.backgroundColor = "rgb(80, 80, 80)"
    }
    ClientServerC = serverclic
    Mario.LoadingState.prototype.Enter
    Enjine.Resources.AddImages(this.Images);
    window.location.href = "#";
    setTimeout(function(){RunMarioScripts();}, 500);
}
function ApplyUpdatedHacks() {
    groundIC = document.getElementById("grooundInertiaCustom").value;
    arialaIC = document.getElementById("airInertiaCustom").value;
    addedMaL = document.getElementById("addedLives").value;
    addedMaC = document.getElementById("addedCoins").value;
    MarioTpe = document.getElementById("MarioType").value;
    Mario.MarioCharacter.GroundInertia = groundIC
    Mario.MarioCharacter.AirInertia = arialaIC
    Mario.MarioCharacter.Fire = allowafire
    if(addedMaL >= Mario.MarioCharacter.Lives) {
        Mario.MarioCharacter.Lives = addedMaL
    }if(addedMaC >= Mario.MarioCharacter.Coins) {
        Mario.MarioCharacter.Coins = addedMaC
    }if(MarioTpe == 2) {
        Mario.MarioCharacter.GetMushroom()
    }if(MarioTpe == 3) {
        Mario.MarioCharacter.GetMushroom()
        Mario.MarioCharacter.GetFlower()
    }
    window.location.href = "#";
}