ClientServerC = true
updateOnlineStatus()

function updateOnlineStatus() {
    online = true
}

function updateOfflineStatus() {
    online = false
}

function RunMarioScripts() {
    if(online == true && ClientServerC == true) {
        if(ver_current != Current_Client_Running_Ver) {
            if(Current_Client_Running_Ver.indexOf("[DEV]") > -1) {
                console.log("_/_/_/    _/_/_/_/    _/     _/")
                console.log("_/   _/   _/          _/    _/")
                console.log("_/   _/   _/_/_/      _/   _/")
                console.log("_/   _/   _/          _/ _/")
                console.log("_/_/_/    _/_/_/_/     _/       _/")
                console.log("Running [DEV]: " + Current_Client_Running_Ver)
            }else{
                MessageDisplay("NOTIFICATION:", "A new version of Mario is avaliable.")
            }
        }if(ver_mustUpdate.indexOf(Current_Client_Running_Ver) > -1) {
            window.location.href = "ZER_29738_RequiredUpdate.html";
        }
    }else{
        MessageDisplay("ERROR:", "You are not online or have turned off Client/Server Communication off so some things might not work...")
    }
}

window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOfflineStatus);