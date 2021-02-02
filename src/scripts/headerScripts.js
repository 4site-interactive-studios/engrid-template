// Intended to be inserted into <head> of the page template
// Detects if the page is embedded in an iFrame and only fires the encapsilated analytic when the iFrame gains focus on the parent page
// IMPORTANT: You should remove the no-js analytics pixel if present in <body>

function isIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
};

function loadScripts(){
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-0000000');
    console.log("Header Scripts Loaded");
}

if(isIframe()){
    var loaded_once;
    window.onfocus = function () {
        if(!loaded_once){
            loadScripts();
            loaded_once = true;
        }
    };
}else{
    loadScripts();
}