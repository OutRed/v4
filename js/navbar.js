function createNavBar() {
    const navBar = document.createElement('div');
    navBar.className = 'navigation-bar';

    const title = document.createElement('div');
    title.className = 'title-nav';
    // title.textContent = 'O'; */

    navBar.appendChild(title);

    const homeLink = createNavLink('Home', '/index.html', true);
    const gamesLink = createNavLink('Games', '/g/index.html');
    const appsLink = createNavLink('Apps', '/apps.html');
    const settingsLink = createNavLink('Settings', '/settings/index.html');

    navBar.appendChild(homeLink);
    navBar.appendChild(gamesLink);
    navBar.appendChild(appsLink);
    navBar.appendChild(settingsLink);

    const targetElement = document.getElementById('navbar');

    targetElement.appendChild(navBar);
}

function createNavLink(text, href, isActive = false) {
    const link = document.createElement('p');
    link.textContent = text;
    link.onclick = function() {
        window.location.href = href;
    };
    if (isActive) {
        link.classList.add('active');
    }
    return link;
}

createNavBar();
