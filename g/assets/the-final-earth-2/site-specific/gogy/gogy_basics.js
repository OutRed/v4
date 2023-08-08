var gameInstance = {
    SendMessage: function (arg1, arg2, arg3) {
        if (arg1 == "Gogy" && arg2 == "GogyCallback") {
            if (window.__gogy_ads_callback != undefined)
                window.__gogy_ads_callback(arg3);
        }
    }
};

window.selected_game_small = {
    id:0,
    swf_file:null
};		
var wgGameOptions = {
    frequency:1, 
    timer:0, 
    game:"gameInstance"
}