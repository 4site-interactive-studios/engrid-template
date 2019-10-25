export const body = document.body;
export const enGrid = document.getElementById("engrid") as HTMLElement;
export const enInput = (() => {
  /* @TODO */
  /************************************
   * Globablly Scoped Constants and Variables
   ***********************************/

  // @TODO Needs to be expanded to bind other EN elements (checkbox, radio) and compound elements (split-text, split-select, select with other input, etc...)
  // @TODO A "Not" condition is needed for .en__field--email because someone could name their email opt in "Email" and it will get the .en_field--email class generated for it
  // get DOM elements
  const init = () => {
    const formInput = document.querySelectorAll(
      ".en__field--text, .en__field--email:not(.en__field--checkbox), .en__field--telephone, .en__field--textarea, .en__field--select"
    );
    const otherInputs = document.querySelectorAll(".en__field__input--other");
    Array.from(formInput).forEach(e => {
      let element = e.querySelector("input, textarea, select") as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (element.value) {
        e.classList.add("has-value");
      }
      bindEvents(e);
    });

    /* @TODO */
    /************************************
     * Automatically select other radio input when an amount is entered into it.
     ***********************************/
    Array.from(otherInputs).forEach(e => {
      ["focus", "input"].forEach(evt => {
        e.addEventListener(
          evt,
          ev => {
            const target = ev.target as HTMLInputElement;
            if (target.parentNode) {
              const targetWrapper = target.parentNode as HTMLElement;
              targetWrapper.classList.remove("en__field__item--hidden");
              if (targetWrapper.parentNode) {
                const lastRadioInput = targetWrapper.parentNode.querySelector(".en__field__item:nth-last-child(2) input") as HTMLInputElement;
                lastRadioInput.checked = !0;
              }
            }
          },
          false
        );
      });
    });
  };

  return {
    init: init
  };
})();

export const setBackgroundImages = () => {
  // Find Inline Background Image, hide it, and set it as the background image.
  let pageBackground = document.querySelector(".page-backgroundImage") as HTMLElement;
  let pageBackgroundImg = document.querySelector(".page-backgroundImage img") as HTMLImageElement;
  let pageBackgroundImgSrc: any = null;

  if (pageBackgroundImg) {
    pageBackgroundImgSrc = pageBackgroundImg.src;
    pageBackgroundImg.style.display = "none";
  }

  if (pageBackground && pageBackgroundImgSrc) {
    pageBackground.style.backgroundImage = "url(" + pageBackgroundImgSrc + ")";
  }
};

export const bindEvents = (e: Element) => {
  /* @TODO */
  /************************************
   * INPUT, TEXTAREA, AND SELECT ACTIVITY CLASSES (FOCUS AND BLUR)
   * NOTE: STILL NEEDS WORK TO FUNCTION ON "SPLIT" CUSTOM EN FIELDS
   * REF: https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event
   ***********************************/

  // Occurs when an input field gets focus
  const handleFocus = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    if (target.parentNode) {
      const targetWrapper = target.parentNode.parentNode as HTMLElement;
      targetWrapper.classList.add("has-focus");
    }
  };

  // Occurs when a user leaves an input field
  const handleBlur = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    if (target.parentNode) {
      const targetWrapper = target.parentNode.parentNode as HTMLElement;
      targetWrapper.classList.remove("has-focus");
      if (target.value) {
        targetWrapper.classList.add("has-value");
      } else {
        targetWrapper.classList.remove("has-value");
      }
    }
  };

  // Occurs when a user changes the selected option of a <select> element
  const handleChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    if (target.parentNode) {
      const targetWrapper = target.parentNode.parentNode as HTMLElement;
      targetWrapper.classList.add("has-value");
    }
  };

  // Occurs when a text or textarea element gets user input
  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    if (target.parentNode) {
      const targetWrapper = target.parentNode.parentNode as HTMLElement;
      targetWrapper.classList.add("has-value");
    }
  };

  // Occurs on browser autofill of fields
  const onAutoFillStart = (e: any) => {
    e.parentNode.parentNode.classList.add("is-autofilled", "has-value");
  };

  const onAutoFillCancel = (e: any) => e.parentNode.parentNode.classList.remove("is-autofilled", "has-value");
  const onAnimationStart = (e: any) => {
    const target = e.target as HTMLElement;
    const animation = e.animationName;
    switch (animation) {
      case "onAutoFillStart":
        return onAutoFillStart(target);
      case "onAutoFillCancel":
        return onAutoFillCancel(target);
    }
  };

  const enField = e.querySelector("input, textarea, select") as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  enField.addEventListener("focus", handleFocus);
  enField.addEventListener("blur", handleBlur);
  enField.addEventListener("change", handleChange);
  enField.addEventListener("input", handleInput);
  enField.addEventListener("animationstart", onAnimationStart);
};

export const debugBar = () => {
  const debugStart = () => {
    body.classList.add("debug-on");
  };

  const debugStop = () => {
    body.classList.remove("debug-on");
  };

  if (
    window.location.search.indexOf("mode=DEMO") > -1 ||
    window.location.href.indexOf("debug") != -1 ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1"
  ) {
    body.classList.add("debug", "demo");
    body.addEventListener("mouseenter", debugStart);
    body.addEventListener("mouseleave", debugStop);
    if (enGrid) {
      enGrid.insertAdjacentHTML(
        "afterend",
        '<span id="debug-bar">' +
          '<button id="visualize-toggle" type="button">Visualize Layout</button>' +
          '<button id="layout-toggle" type="button">Layout Toggle</button>' +
          "</span>"
      );
    }
    if (document.getElementById("visualize-toggle")) {
      const debugTemplateButton = document.getElementById("visualize-toggle");
      if (debugTemplateButton) {
        debugTemplateButton.addEventListener(
          "click",
          function() {
            visualizeToggle();
          },
          false
        );
      }
    }

    if (document.getElementById("layout-toggle")) {
      const debugTemplateButton = document.getElementById("layout-toggle");
      if (debugTemplateButton) {
        debugTemplateButton.addEventListener(
          "click",
          function() {
            layoutToggle();
          },
          false
        );
      }
    }

    const visualizeToggle = () => {
      if (body) {
        if (body.classList.contains("visualize-outline")) {
          removeClassesByPrefix(body, "visualize-");
          body.classList.add("visualize-blocks");
        } else if (body.classList.contains("visualize-blocks")) {
          removeClassesByPrefix(body, "visualize-");
        } else if (body) {
          body.classList.add("visualize-outline");
        } else {
          console.log("While trying to switch visualizations, something unexpected happen.");
        }
      }
    };

    const layoutToggle = () => {
      if (enGrid) {
        if (enGrid.classList.contains("layout-leftleft1col")) {
          removeClassesByPrefix(enGrid, "layout-");
          enGrid.classList.add("layout-centerleft1col");
        } else if (enGrid.classList.contains("layout-centerleft1col")) {
          removeClassesByPrefix(enGrid, "layout-");
          enGrid.classList.add("layout-centercenter1col");
        } else if (enGrid.classList.contains("layout-centercenter1col")) {
          removeClassesByPrefix(enGrid, "layout-");
          enGrid.classList.add("layout-centercenter2col");
        } else if (enGrid.classList.contains("layout-centercenter2col")) {
          removeClassesByPrefix(enGrid, "layout-");
          enGrid.classList.add("layout-debug");
        } else if (enGrid.classList.contains("layout-debug")) {
          removeClassesByPrefix(enGrid, "layout-");
          enGrid.classList.add("layout-leftleft1col");
        } else {
          console.log("While trying to switch layouts, something unexpected happen.");
        }
      }
    };

    const removeClassesByPrefix = (el: HTMLElement, prefix: string) => {
      for (var i = el.classList.length - 1; i >= 0; i--) {
        if (el.classList[i].startsWith(prefix)) {
          el.classList.remove(el.classList[i]);
        }
      }
    };
  }
};
