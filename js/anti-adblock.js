function showAlertWithExpiry() {
    // Check if the alert was already shown within the last week
    var lastAlertTime = localStorage.getItem("lastAlertTime");
    if (lastAlertTime && Date.now() - lastAlertTime < 7 * 24 * 60 * 60 * 1000) {
      return; // Don't show the alert if less than a week has passed
    }

    // Show the alert
    alert("Hello! Thank you for supporting us by disabling your ad blocker. Doing so lets us keep this website running!");

    // Save the time the alert was shown
    localStorage.setItem("lastAlertTime", Date.now());
  }

  // Show the alert when the page is loaded
  showAlertWithExpiry();