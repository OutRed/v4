// Function to update the title
function updateTitle() {
  // Get the input value
  var newTitle = document.getElementById("titleInput").value;

  // If the input value is empty, set the title to the default value
  if (newTitle.trim() === "") {
    newTitle = { $item, title }; // Default value
  }

  // Update the title of the webpage
  document.title = newTitle;

  // Save the new title to localStorage
  localStorage.setItem("pageTitle", newTitle);

  // Save the input value to localStorage
  localStorage.setItem("inputValue", newTitle);
}

// Function to reset the title to the default value
function resetTitle() {
  // Reset the title of the webpage
  document.title = "OutRed | Settings";

  // Remove the title and input value from localStorage
  localStorage.removeItem("pageTitle");
  localStorage.removeItem("inputValue");
  document.getElementById("titleInput").value = "";
}

// Function to set the title and input value from localStorage
function setTitleAndInputFromStorage() {
  var savedTitle = localStorage.getItem("pageTitle");
  var savedInputValue = localStorage.getItem("inputValue");
  if (savedTitle !== null) {
    // If there's a saved title, update the webpage title
    document.title = savedTitle;
    // If there's an input field with id "titleInput", update its value
    var titleInput = document.getElementById("titleInput");
    if (titleInput !== null) {
      titleInput.value = savedInputValue;
    }
  }
}

// Call the function to set the title and input value from localStorage when the page loads
setTitleAndInputFromStorage();

// stuff for favicon:

// Function to update the favicon
function updateFavicon() {
  // Get the input value for favicon
  var newFavicon = document.getElementById("faviconInput").value;

  // If the input value for favicon is empty, set it to the default value
  if (newFavicon.trim() === "") {
    newFavicon = "/assets/favicon.png"; // Default favicon URL
  }

  // Update the favicon of the webpage
  var favicon = document.getElementById("favicon");
  favicon.href = newFavicon;

  // Save the new favicon to localStorage
  localStorage.setItem("faviconURL", newFavicon);
}

// Function to reset the favicon to the default value
function resetFavicon() {
  // Get the default favicon for this page
  var defaultFavicon = "/assets/favicon.png"; // Default favicon URL

  // Reset the favicon of the webpage
  var favicon = document.getElementById("favicon");
  favicon.href = defaultFavicon;
  document.getElementById("faviconInput").value = "";

  // Remove the favicon from localStorage
  localStorage.removeItem("faviconURL");
}

// Function to set the favicon from localStorage
function setFaviconFromStorage() {
  var savedFavicon = localStorage.getItem("faviconURL");
  if (savedFavicon !== null) {
    // If there's a saved favicon, update the favicon
    var favicon = document.getElementById("favicon");
    favicon.href = savedFavicon;
    // If there's an input field with id "faviconInput", update its value
    var faviconInput = document.getElementById("faviconInput");
    if (faviconInput !== null) {
      faviconInput.value = savedFavicon;
    }
  }
}

// Call the function to set the favicon from localStorage when the page loads
setFaviconFromStorage();
