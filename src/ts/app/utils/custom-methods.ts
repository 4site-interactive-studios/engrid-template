export const enInput = (() => {

/* @TODO */
/************************************
 * Globablly Scoped Constants and Variables
 ***********************************/
const body = document.body;
const gridWrapper = document.getElementById("grid-wrapper");

/* @TODO */
/************************************
 * Defines what happens on DOM Content Loaded
 ***********************************/
document.addEventListener(
  "DOMContentLoaded",
  function() {
    onDOMContentLoaded();
  },
  false
);

function onDOMContentLoaded() {
  body.classList.remove("loading");
  body.classList.add("loaded");
  setBackgroundImages();
  debugBar();
}

/* @TODO */
/************************************
 * INPUT, TEXTAREA, AND SELECT ACTIVITY CLASSES (FOCUS AND BLUR)
 * NOTE: STILL NEEDS WORK TO FUNCTION ON "SPLIT" CUSTOM EN FIELDS
 * REF: https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event
 ***********************************/
  // Occurs when an input field gets focus
  const handleFocus = (e:any) => {
    const target = e.target;
    const targetWrapper = target.parentNode.parentNode;
    targetWrapper.classList.add("has-focus");
  };

  // Occurs when a user leaves an input field
  const handleBlur = (e:any) => {
    const target = e.target;
    const targetWrapper = target.parentNode.parentNode;
    targetWrapper.classList.remove("has-focus");

    if (target.value) {
      targetWrapper.classList.add("has-value");
    } else {
      targetWrapper.classList.remove("has-value");
    }
  };

  // Occurs when a user changes the selected option of a <select> element
  const handleChange = (e:any) => {
    const target = e.target;
    const targetWrapper = target.parentNode.parentNode;
    targetWrapper.classList.add("has-value");
  };  

  // Occurs when a text or textarea element gets user input
  const handleInput = (e:any) => {
    const target = e.target;
    const targetWrapper = target.parentNode.parentNode;
    targetWrapper.classList.add("has-value");
  };

  // Occurs on browser autofill of fields
  const onAutoFillStart = (e:any) =>
    e.parentNode.parentNode.classList.add("is-autofilled", "has-value");
  const onAutoFillCancel = (e:any) =>
    e.parentNode.parentNode.classList.remove("is-autofilled", "has-value");
  const onAnimationStart = ({ (target:any), (animationName:any) }) => {
    switch (animationName) {
      case "onAutoFillStart":
        return onAutoFillStart(target);
      case "onAutoFillCancel":
        return onAutoFillCancel(target);
    }
  };

  // Register events
  const bindEvents = (e:any) => {
    const enField = e.querySelector("input, textarea, select");
    enField.addEventListener("focus", handleFocus);
    enField.addEventListener("blur", handleBlur);
    enField.addEventListener("change", handleChange);
    enField.addEventListener("input", handleInput);
    enField.addEventListener("animationstart", onAnimationStart, false);
  };

  // @TODO Needs to be expanded to bind other EN elements (checkbox, radio) and compound elements (split-text, split-select, select with other input, etc...)
  // get DOM elements
  const init = () => {
    const formInput = document.querySelectorAll(
      ".en__field--text, .en__field--textarea, .en__field--select"
    );
    formInput.forEach(e => {
      if (e.querySelector("input, textarea, select").value) {
        e.parentNode.parentNode.classList.add("has-value");
      }
      bindEvents(e);
    });
  };

/* @TODO */
/************************************
 * Automatically select other radio input when an amount is entered into it.
 ***********************************/
(function() {
  for (
    var e = document.querySelectorAll(
        ".en__field__input--other"
      ),
      t = 0;
    t < e.length;
    t++
  )
    e[t].addEventListener("focus", function(e) {
      this.parentNode.classList.remove('en__field__item--hidden');
      this.parentNode.parentNode.querySelector(
        ".en__field__item:nth-last-child(2) input"
      ).checked = !0;
    });
})();


/* @TODO Not sure where this came from*/
export const log = (text : string) => {
  console.log(text);
}


/* @TODO This code feels messy*/
function setBackgroundImages(){
  // Find Inline Background Image, hide it, and set it as the background image.
  var p_background = document.querySelector(".pb");
  var p_backgroundImg = document.querySelector(".pb img");
  var p_backgroundImgSrc;

  if (p_backgroundImg) {
    p_backgroundImgSrc = document.querySelector(".pb img").src;
    p_backgroundImg.style.display = "none";
  }

  if (p_background && p_backgroundImgSrc) {
    p_background.style.backgroundImage =
      "url(" + p_backgroundImgSrc + ")";
  }
}

function debugBar(){
  if (window.location.search.indexOf("mode=DEMO") > -1) {
    // More advanced method: https://gomakethings.com/getting-all-query-string-values-from-a-url-with-vanilla-js/
    body.classList.add("demo");
    gridWrapper.insertAdjacentHTML(
      "afterend",
      '<span id="debug"><button id="debug-template" type="button" onclick="debugTemplate()">Outlines</button><button id="visualize-layout" type="button" onclick="visualizeLayout()">Blocks</button><button id="layoutleft" type="button" onclick="layoutleftleft()">Layout Left Left</button><button id="layoutcenter" type="button" onclick="layoutcenterleft()">Layout Center Left</button><button id="layoutcentercenter" type="button" onclick="layoutcentercenter()">Layout Center Center</button></span>'
    );
  }
}

function debugTemplate() {
  if (body) {
    body.classList.toggle("debug");
    body.classList.remove("visualize-layout");
  }
}

function visualizeLayout() {
  if (body) {
    body.classList.toggle("visualize-layout");
    body.classList.remove("debug");
  }
}

/* @TODO The code for removing/adding layout classes is overkill. Probably a better way to do it by having the classes prefixed with something like "l-" so they can be removed in bulk */
function layoutleftleft() {
  if (gridWrapper) {
    gridWrapper.classList.remove("left-left");
    gridWrapper.classList.remove("center-left");
    gridWrapper.classList.remove("center-center");
    gridWrapper.classList.add("left-left");
  }
}

function layoutcenterleft() {
  if (gridWrapper) {
    gridWrapper.classList.remove("left-left");
    gridWrapper.classList.remove("center-left");
    gridWrapper.classList.remove("center-center");
    gridWrapper.classList.add("center-left");
  }
}
function layoutcentercenter() {
  if (gridWrapper) {
    gridWrapper.classList.remove("left-left");
    gridWrapper.classList.remove("center-left");
    gridWrapper.classList.remove("center-center");
    gridWrapper.classList.add("center-center");
  }
}  

  return {
    init: init
  };
})();

enInput.init();