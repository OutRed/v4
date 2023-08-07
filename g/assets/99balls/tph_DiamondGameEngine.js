// main
var canvas                    = document.getElementById('canvas');
var gm4html5_div              = document.getElementById('gm4html5_div_id');
var canvas_parent_div         = document.getElementById('canvas_parent');
var game_width                = canvas.width;
var game_height               = canvas.height;
var is_mobile                 = isMobile();
var is_app_focused            = document.hasFocus();
var show_rotate_device_screen = true;
var show_loading_screen       = true;

// preloader
var loadingProgress           = 0;

var preloader_bar_x           = game_width*0.5;
var preloader_bar_y           = game_height*0.8;
var preloader_bar_width       = game_width * 0.5;
var preloader_bar_height      = 20;

 
dg_initialize();

//////////////////// Functionality ////////////////////

function dg_iframed( )
{
	if(window.self != window.top)
    	return 1; else
    	return 0;
}

function dg_initialize()
{
    // PRELOADER SETUP

    if (!show_loading_screen) dg_hide_loading(); else
    resizeLoadingImg();

    // SCROLL GAME TO THE TOP OF THE BROWSER

    window.addEventListener('scroll', function () 
    {
    // Do not scroll when keyboard is visible 
    if (document.activeElement === document.body && window.scrollY > 3) {
        document.body.scrollTop = 0;
        }
    }, true);    

    // GAME BROWSER FOCUS CONTROL

    window.onfocus = function()
    {
         is_app_focused = true;
    }

    window.onblur = function()
    {
         is_app_focused = false;
    }

}


function isMobile() 
{
    var no_mobile = false;

    /*// 1st method
    try
    { 
      document.createEvent("TouchEvent"); return true; 
    }
    catch(e){ no_mobile = true; }*/

    // 2nd method
    if (true)
    {
      testExp = new RegExp('Android|webOS|iPhone|iPad|' +
                 'BlackBerry|Windows Phone|'  +
                 'Opera Mini|IEMobile|Mobile' , 
                'i');
      if (testExp.test(navigator.userAgent)) return true; else return false;
    }
}


function getDocWidth() 
{
  if (self.innerHeight) {
      return self.innerWidth;
      }

  if (document.documentElement && document.documentElement.clientHeight) {
      return document.documentElement.clientWidth;
  }

  if (document.body) {
      return document.body.clientWidth;
  }
}

function getDocHeight() 
{
  if (self.innerHeight) {
      return self.innerHeight;
    }

  if (document.documentElement && document.documentElement.clientHeight) {
    return document.documentElement.clientHeight;
  }

  if (document.body) {
    return document.body.clientHeight; 
  }
}

function resizeLoadingImg()
{
  var imgLoad       = document.getElementById("GM4HTML5_loadingscreen");
  var imgBar        = document.getElementById("GM4HTML5_loadingbar");
  var wbr           = getDocWidth();
  var hbr           = getDocHeight();

  // loading screen
  if (show_loading_screen)
  if (imgLoad && imgBar)
  if (game_width > game_height)
  { 
    imgLoad.style.width = wbr +"px";
    imgLoad.style.height = wbr/game_width * game_height +"px";
    imgLoad.style.left = 0 + "px";
    imgLoad.style.top  = 0 + "px";
  } else
  {
    imgLoad.style.height = hbr +"px";
    imgLoad.style.width = hbr/game_height * game_width + "px";
    imgLoad.style.left  = (wbr-hbr/game_height * game_width)/2 +"px";
    imgLoad.style.top     = 0 + "px";

    imgBar.style.height = hbr/game_height*preloader_bar_height +"px";
    imgBar.style.width = loadingProgress * preloader_bar_width * hbr/game_height + "px";
    imgBar.style.left  = (wbr-hbr/game_height * preloader_bar_width)/2 +"px";
    imgBar.style.top     = hbr*preloader_bar_y/game_height + "px";
  }

  // rotate screen
  if (show_rotate_device_screen) 
  if (is_mobile == true)
  {
    var imgRotate       = document.getElementById("rotatescreen");
    if (imgRotate)
    if (game_width > game_height)
    {
      if (hbr > wbr) 
      {
        imgRotate.style.left          = 0 +"px";
        imgRotate.style.top           = 0 + "px";
        imgRotate.style.height        = hbr +"px";
        imgRotate.style.width         = wbr + "px";
        imgRotate.style.display       ="block";
        imgRotate.style.pointerEvents = 'auto';
      } else
      {
        imgRotate.style.display       ="none";
        imgRotate.style.pointerEvents = 'none';
      }
    } else
    {
      if (hbr < wbr) 
      {
        imgRotate.style.left          = 0 +"px";
        imgRotate.style.top           = 0 + "px";
        imgRotate.style.height        = hbr +"px";
        imgRotate.style.width         = wbr + "px";
        imgRotate.style.display       ="block";
        imgRotate.style.pointerEvents = 'auto';
      } else
      {
      imgRotate.style.display       ="none";
      imgRotate.style.pointerEvents = 'none';
      }
    }
  }

  // run again in 0.5 sec
  setTimeout(resizeLoadingImg, 500);
}

// Based on FMS loading
function dg_loading_function(_graphics, _width, _height, _total, _current, _loadingscreen) 
{
  loadingProgress = 1/_total * _current;

}

function dg_hide_loading()
{
    var imgBar        = document.getElementById("GM4HTML5_loadingscreen");
    if (imgBar)
    {
      imgBar.style.display        ="none";
      imgBar.style.visibility     ="hidden";
      imgBar.style.pointerEvents  = 'none';
      imgBar.parentNode.removeChild(imgBar);
    }

    imgBar        = document.getElementById("GM4HTML5_loadingbar");
    if (imgBar)
    {
      imgBar.style.display        ="none";
      imgBar.style.visibility     ="hidden";
      imgBar.style.pointerEvents  = 'none';
      imgBar.parentNode.removeChild(imgBar);
    }

    if (canvas_parent_div)
      canvas_parent_div.style.display = "block";
}

function dg_eval(code)
{
  eval(code);
}

function dg_set_document_body_color(newColor)
{
  document.body.style.backgroundColor = newColor;
}

function dg_set_document_title(newTitle)
{
  document.title = newTitle;
}

function dg_set_button_params(buttonID, _x, _y, _width, _height )
{
  var b = document.getElementById(buttonID);
  if (b)
  {
    var wbr           = getDocWidth();
    var hbr           = getDocHeight();
    var scale_scr     = hbr/game_height;

    b.style.left = (wbr-scale_scr * game_width)/2 + _x - _width * 0.5 + "px";
    b.style.top = (hbr-scale_scr * game_height)/2 + _y - _height * 0.5 + "px";
    b.style.width = _width * scale_scr + "px";
    b.style.height = _height * scale_scr + "px";
    b.style.pointerEvents = "auto";
  }
}

function dg_disable_button( buttonID )
{
  var b = document.getElementById(buttonID);
  if (b) b.style.pointerEvents = 'none';
}