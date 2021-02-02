// Checks to see if the browser is IE11
if(navigator.appName.indexOf("Internet Explorer")!=-1 || navigator.userAgent.match(/Trident.*rv[ :]*11\./)){
    const enGrid = document.getElementById("engrid");

    // Add the data-engrid-internet-explorer attribute when inside an iFrame
    document.getElementsByTagName("BODY")[0].setAttribute("data-engrid-internet-explorer", "");    

    // Add the IE11 Time to Die CSS to the page
    enGrid.insertAdjacentHTML('beforeend', '<style>#ie--box { position: absolute!important; top: 0!important; width: 100%!important; z-index: 99999999!important } .ie--box-bg { display: block; width: 100%; height: 100%; position: fixed; top: 0; right: 0; background-color: rgba(0, 0, 0, .5); z-index: 1000 } .ie--box-wrapper { display: block; position: relative; border-radius: 8px; max-width: 700px; width: 90%; margin: auto; margin-top: 30vh; padding: 3rem; background-color: #fff; z-index: 1001; box-shadow: 0 0 53px -11px rgba(0, 0, 0, .38) } #ie--box-x { text-align: right; margin-top: -1rem; margin-right: -1.2rem; margin-bottom: -1rem; font-weight: 700; cursor: pointer }</style>');

    // Add the IE11 Time to Die HTML to the DOM
    enGrid.insertAdjacentHTML('beforeend', '<div id="ie--box" style="display: none;"> <div class="ie--box-bg" onclick="closeBanner()"></div> <div class="ie--box-wrapper"> <div id="ie--box-x" onclick="closeBanner()">X</div> <div class="ie--box-msg"> <b>Attention:</b> Your browser is no longer supported and will not receive any further security updates. Websites may no longer display or behave correctly as they have in the past. Please transition to using <a href="https://www.microsoft.com/en-us/edge" target="_blank">Microsoft Edge</a>, Microsoft\'s latest browser, to continue enjoying the modern web. </div> </div> </div>');

    // The close function is called directly from the page-pop up
    function closeBanner() {
        document.querySelector("#ie--box").style.display = "none";
    }
}