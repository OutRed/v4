// Function to update the title
function updateTitle() {
    // Get the input value
    var newTitle = document.getElementById("titleInput").value;
    
    // If the input value is empty, set the title to the default value
    if (newTitle.trim() === "") {
        newTitle = {$item,title}; // Default value
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
