if (!localStorage.getItem('currentapp')) location.pathname = '/load-app.html';
document.getElementById('game-frame').src = localStorage.getItem("currentapp");
document.getElementById('g-name').textContent = localStorage.getItem("currenttitle");
document.getElementById('g-description').textContent = localStorage.getItem("currentdescription");