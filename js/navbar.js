// Function to create the navigation bar
function createNavBar() {
    // Create the navigation bar container
    const navBar = document.createElement('div');
    navBar.className = 'navigation-bar';

    // Create the navigation links
    const homeLink = createNavLink('Home', '/index.html', true);
    const gamesLink = createNavLink('Games', '/g/index.html');
    const appsLink = createNavLink('Apps', '/apps.html');
    const settingsLink = createNavLink('Settings', '/settings/index.html');

    // Append the navigation links to the navigation bar
    navBar.appendChild(homeLink);
    navBar.appendChild(gamesLink);
    navBar.appendChild(appsLink);
    navBar.appendChild(settingsLink);

    // Get the target element where the navigation bar will be added
    const targetElement = document.getElementById('navbar');

    // Add the navigation bar to the target element
    targetElement.appendChild(navBar);
}

// Function to create a navigation link
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

// Call the function to create the navigation bar
createNavBar();