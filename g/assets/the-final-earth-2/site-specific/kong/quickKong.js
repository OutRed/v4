(function()
{
    var kongAPI, hasKongNow = false;

    function loadJS(filename, then) {
        var scriptelem = document.createElement('script');
        scriptelem.setAttribute("src", filename);
        document.getElementsByTagName('head')[0].appendChild(scriptelem);
        scriptelem.onload = then;
    };

    window.QuickKong = {};

    QuickKong.doInitKong = function() {
        try {
            loadJS("https://cdn1.kongregate.com/javascripts/kongregate_api.js", function() {
                kongregateAPI.loadAPI(function() {
                    kongAPI = kongregateAPI.getAPI();
                    hasKongNow = true;
                    console.log("Kongregate API now available!");
                });
            });
        } catch (err) {

        }
    };

    QuickKong.setStat = function(stat, number) {
        if (! hasKongNow) return;
        try {
            if (! kongAPI.services.isGuest()) {
                kongAPI.stats.submit(stat, number);
            }
        } catch (err) {

        }
    };
})();