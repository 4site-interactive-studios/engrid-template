// Loads client theme scripts as soon as possible, but never before DOMContentLoaded
if (document.readyState !== "loading") {
    this.run();
} else {
    document.addEventListener("DOMContentLoaded", () => {
      this.run();
    });
};

function run(){
    console.log("ENGrid client theme main.js scripts are executing");
    // Add your client theme functions and scripts here
}