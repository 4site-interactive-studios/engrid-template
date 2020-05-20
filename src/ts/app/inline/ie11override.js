// Intended to be inserted into <head> of the page template
// Adds the "layout-ie11override" class with IE11 is detected 
const enGrid = document.getElementById("engrid");

if(navigator.appName.indexOf("Internet Explorer")!=-1 || navigator.userAgent.match(/Trident.*rv[ :]*11\./)){
    // @TODO We should also find a way to let each client right a "Legacy Support" message that gets inserted at the top of IE 11 pages
    if (!enGrid.classList.contains("layout-embedded")) {
        enGrid.classList.add("layout-ie11override");
    }
}