if (!localStorage.getItem('currentapp')) location.pathname = '/load-app.html';
document.getElementById('game-frame').src = localStorage.getItem("currentapp");
document.getElementById('g-name').textContent = localStorage.getItem("currenttitle");
document.getElementById('g-description').textContent = localStorage.getItem("currentdescription"); 
/*
const iframe = document.getElementById('game-frame');
iframe.src = /*$__uvconfig.encode ('https://example.com};'); // put the uv encode function in place of the encode url function
document.body.appendChild(iframe);*/