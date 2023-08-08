var hasWebGL = (function(){
  if (!window.WebGLRenderingContext) 
  {
    // Browser has no idea what WebGL is. Suggest they
    // get a new browser by presenting the user with link to
    // http://get.webgl.org
    return 0;   
  }

  var canvas = document.createElement('canvas'); 
  var gl = canvas.getContext("webgl");   
  if (!gl) 
  {
    gl = canvas.getContext("experimental-webgl");   
    if (!gl) 
    {
      // Browser could not initialize WebGL. User probably needs to
      // update their drivers or get a new browser. Present a link to
      // http://get.webgl.org/troubleshooting
      return 0;  
    }
  }
  return 1;
})();

function CompatibilityCheck()
{
var browser = (function(){
  var ua= navigator.userAgent, tem, 
  M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if(/trident/i.test(M[1])){
    tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
    return 'IE '+(tem[1] || '');
  }
  if(M[1]=== 'Chrome'){
    tem= ua.match(/\bOPR\/(\d+)/)
    if(tem!= null) return 'Opera '+tem[1];
  }
  M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
  if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
  return M.join(' ');
})();

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
  // the main webpage handles this
  return "mobile";
} else if (browser.indexOf("IE") >= 0) {
  // if IE, webgl works but poorly so redirect to unsupported
  window.location.href = "UnsupportedBrowser/index.html";
  return "unsupported";
} else if (!hasWebGL) { // test if webgl works
  if (browser.indexOf("Chrome") >= 0 || browser.indexOf("Safari") >= 0 || browser.indexOf("Firefox") >= 0 || browser.indexOf("msie") >= 0) {
    // if supported browser, notify and redirect to help page
    window.location.href = "UnsupportedConfiguration/index.html";
    return "unsupported";
  } else {
    // otherwise show error message
    window.location.href = "UnsupportedBrowser/index.html";
    return "unsupported";
  }
  }

return null;
}