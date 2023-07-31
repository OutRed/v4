function openInNewWindowApps() {
    // Check if LocalStorage is supported in the current browser
    if (typeof(Storage) !== "undefined") {
      // Get the link from the "currentapp" key in LocalStorage
      const link = localStorage.getItem("currentapp");
      
      // Check if a link exists in the "currentapp" key
      if (link) {
        // Open the link in a new tab
        window.open(link, '_blank');
      } else {
        console.log("No link found in LocalStorage under 'currentapp'.");
      }
    } else {
      console.log("LocalStorage is not supported in this browser.");
    }
  }  