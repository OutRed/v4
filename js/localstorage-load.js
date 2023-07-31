if (!localStorage.getItem('currentgame')) location.pathname = '/g/load.html';
document.getElementById('game-frame').src = localStorage.getItem("currentgame");
document.getElementById('g-name').textContent = localStorage.getItem("currenttitle");
document.getElementById('g-description').textContent = localStorage.getItem("currentdescription");