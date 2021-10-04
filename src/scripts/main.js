// Fires scripts ASAP, but not before DOMContentLoaded
// Accounts for the circumstance where the DOMContentLoaded event has already triggered
const DOMReady = function(callback) {
  document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
}

DOMReady(function() {
    console.log("ENGrid client scripts are executing");
    // Add your client scripts here
}
