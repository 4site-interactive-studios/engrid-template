// Depends on engrid-click-to-expand.scss to work
// Works when the user has adds ".click-to-expand" as a class to any field
// @TODO Doesn't work if multiple ".click-to-expand" classes are defined on a single page
// @TODO OC: Fernando to check port of original code and confirm if working (https://d2amdniajcqcy4.cloudfront.net/donation/js/oc-en-click-to-expand.js)

declare global {
    interface Window {
        expandDiv: HTMLElement;
    }
}

let clickToExpandWrapper =  document.querySelector('.click-to-expand') as HTMLElement;

export default class ClickToExpand{    
    if (clickToExpandWrapper:HTMLElement) {
        var existing_html = clickToExpandWrapper.innerHTML;
        var wrapper_html = '<div class="click-to-expand-cta" onclick="expandDiv()"></div><div class="click-to-expand-text-wrapper" onclick="expandDiv()">' + existing_html + '</div>';	
        clickToExpandWrapper.innerHTML = wrapper_html;
        clickToExpandWrapper.style.opacity = '1';
    }

    expandDiv = () => {
        clickToExpandWrapper.classList.add("expanded");
    }
}