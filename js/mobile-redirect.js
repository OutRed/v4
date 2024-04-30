 // Check if the device is a mobile device
 function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

// Redirect to a specific page if the user is on a mobile device
function redirectToMobilePage() {
    if (isMobileDevice()) {
        window.location.href = "mobile-page.html";
    }
}

// Call the function when the page loads
window.onload = function() {
    redirectToMobilePage();
};