(function () {
  'use strict';

  var isCommonjs = typeof module !== 'undefined' && module.exports;
  var keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;

  var fn = (function () {
    var val;
    var valLength;

    var fnMap = [
      [
        'requestFullscreen',
        'exitFullscreen',
        'fullscreenElement',
        'fullscreenEnabled',
        'fullscreenchange',
        'fullscreenerror'
      ],
      // new WebKit
      [
        'webkitRequestFullscreen',
        'webkitExitFullscreen',
        'webkitFullscreenElement',
        'webkitFullscreenEnabled',
        'webkitfullscreenchange',
        'webkitfullscreenerror'

      ],
      // old WebKit (Safari 5.1)
      [
        'webkitRequestFullScreen',
        'webkitCancelFullScreen',
        'webkitCurrentFullScreenElement',
        'webkitCancelFullScreen',
        'webkitfullscreenchange',
        'webkitfullscreenerror'

      ],
      [
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozFullScreenElement',
        'mozFullScreenEnabled',
        'mozfullscreenchange',
        'mozfullscreenerror'
      ],
      [
        'msRequestFullscreen',
        'msExitFullscreen',
        'msFullscreenElement',
        'msFullscreenEnabled',
        'MSFullscreenChange',
        'MSFullscreenError'
      ]
    ];

    var i = 0;
    var l = fnMap.length;
    var ret = {};

    for (; i < l; i++) {
      val = fnMap[i];
      if (val && val[1] in document) {
        for (i = 0, valLength = val.length; i < valLength; i++) {
          ret[fnMap[0][i]] = val[i];
        }
        return ret;
      }
    }

    return false;
  })();

  var screenfull = {
    request: function (elem) {
      var request = fn.requestFullscreen;

      elem = elem || document.documentElement;

      // Work around Safari 5.1 bug: reports support for
      // keyboard in fullscreen even though it doesn't.
      // Browser sniffing, since the alternative with
      // setTimeout is even worse.
      if (/5\.1[\.\d]* Safari/.test(navigator.userAgent)) {
        elem[request]();
      } else {
        elem[request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
      }
    },
    exit: function () {
      document[fn.exitFullscreen]();
    },
    toggle: function (elem) {
      if (this.isFullscreen) {
        this.exit();
      } else {
        this.request(elem);
      }
    },
    raw: fn
  };

  if (!fn) {
    if (isCommonjs) {
      module.exports = false;
    } else {
      window.screenfull = false;
    }

    return;
  }

  Object.defineProperties(screenfull, {
    isFullscreen: {
      get: function () {
        return Boolean(document[fn.fullscreenElement]);
      }
    },
    element: {
      enumerable: true,
      get: function () {
        return document[fn.fullscreenElement];
      }
    },
    enabled: {
      enumerable: true,
      get: function () {
        // Coerce to boolean in case of old WebKit
        return Boolean(document[fn.fullscreenEnabled]);
      }
    }
  });

  if (isCommonjs) {
    module.exports = screenfull;
  } else {
    window.screenfull = screenfull;
  }
})();


var canToggle             = false; // флаг определяет можно ли нам переключаться в фулл. Устанавливается когда польз-ль нажимает кнопку тоггла в игре.
var fullscreenButton      = document.getElementById('toggle_fullscreen_button');
var _canvas               = document.getElementById("gm4html5_div_id");
var _canvas2              = document.getElementById("canvas");

/*
function js_step()
{
  var dx = 0;
  var dy = 0;
  var scaleW = 1;
  var scaleH = 1;

  if (screenfull.isFullscreen)
  if (GAME_WIDTH < GAME_HEIGHT)
  {
    _canvas.style.left  = "0px";
    _canvas.style.top     = "0px";
    _canvas.style.width = window.innerWidth - dx + "px";
    _canvas.style.height = window.innerHeight - dy + "px";
  }
}*/

// Установить параметры кнопки переключения в фулскрин
// х, у           - позиция центра кнопки в пикселях
// width, height  - размер кнопки в пикселях

function js_setFullscreenButtonParams( _x, _y, _width, _height )
{
  toggleButton.style.left = _x - _width * 0.5 + "px";
  toggleButton.style.top = _y - _height * 0.5 + "px";
  toggleButton.style.width = _width + "px";
  toggleButton.style.height = _height + "px";
  toggleButton.style.pointerEvents = "auto";
}

function js_disableFullscreenButton( )
{
  toggleButton.style.pointerEvents = 'none';
}

function js_initFullscreenButton()
{
      js_disableFullscreenButton( );

      toggleButton.addEventListener('click', function () 
      {
        // код работы кнопки тоггла

        if (screenfull.enabled) 
        {
           screenfull.toggle(document.getElementById("gm4html5_div_id"));
        }
      }, 
    true);
}

function js_isFullscreenEnabled( )
{
  return screenfull.isFullscreen;
}

function js_isFullscreenAvaliable( )
{
  return screenfull.enabled;
}