export const body = document.body;
export const enGrid = document.getElementById("engrid") as HTMLElement;
export const enInput = (() => {
  /* @TODO */
  /************************************
   * Globablly Scoped Constants and Variables
   ***********************************/

  // @TODO Needs to be expanded to bind other EN elements (checkbox, radio) and compound elements (split-text, split-select, select with other input, etc...)
  // @TODO A "Not" condition is needed for #en__field_transaction_email because someone could name their email opt in "Email" and it will get the .en_field--email class generated for it
  // get DOM elements
  const init = () => {
    const formInput = document.querySelectorAll(
      ".en__field--text, .en__field--email:not(.en__field--checkbox), .en__field--telephone, .en__field--number, .en__field--textarea, .en__field--select, .en__field--checkbox"
    );
    const otherInputs = document.querySelectorAll(".en__field__input--other");
    Array.from(formInput).forEach(e => {
      // @TODO Currently checkboxes always return as having a value, since they do but they're just not checked. Need to update and account for that, should also do Radio's while we're at it
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
  let pageBackgroundLegacyImg = document.querySelector(".background-image p") as HTMLElement;
  
  let pageBackgroundImgSrc: any = null;

  if (pageBackgroundImg) {
    pageBackgroundImgSrc = pageBackgroundImg.src;
    // pageBackgroundImg.style.display = "none";
  } else {
    pageBackgroundImgSrc = pageBackgroundLegacyImg.innerHTML;
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
    if (body.classList.contains("debug-enabled")) {
      body.classList.remove("debug-off");
      body.classList.add("debug-on");
    }
  };

  const debugStop = () => {
    if (body.classList.contains("debug-enabled")) {
      body.classList.remove("debug-on");
      body.classList.add("debug-off");
      // const debugBar = (HTMLButtonElement) => document.getElementById("debug-toggle");
      // if(debugBar){
      //   debugBar.innerHTML = "Turn Debug On";
      // }
    }
  };

  if (
    window.location.search.indexOf("mode=DEMO") > -1 ||
    window.location.href.indexOf("debug") != -1 ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1"
  ) {
    body.classList.add("debug-disabled");
    body.classList.add("debug-off");
    // body.addEventListener("mouseenter", debugStart);
    // body.addEventListener("mouseleave", debugStop);
    if (enGrid) {
      enGrid.insertAdjacentHTML(
        "afterend",
        '<span id="debug-bar">' +
          // '<button id="debug-toggle" type="button">Turn Debug On</button>' +
          '<button id="layout-toggle" type="button">Layout Toggle</button>' +
          "</span>"
      );
    } else {
      body.classList.add("debug-disabled");
    }
    if (document.getElementById("debug-toggle")) {
      const debugTemplateButton = document.getElementById("debug-toggle");
      if (debugTemplateButton) {
        debugTemplateButton.addEventListener(
          "click",
          function() {
            debugToggle();
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

    const debugToggle = () => {
      if (body) {
        if (body.classList.contains("debug-enabled")) {
          body.classList.remove("debug-enabled");
          body.classList.remove("debug-on");
          body.classList.add("debug-disabled");
          body.classList.add("debug-off");
        } else if (body.classList.contains("debug-disabled")) {
          body.classList.remove("debug-disabled");
          body.classList.remove("debug-off");
          body.classList.add("debug-enabled");
          body.classList.add("debug-on");
        } else {
          console.log("While trying to switch visualizations, something unexpected happen.");
        }
      }
    };

    const layoutToggle = () => {
      if (enGrid) {
        // if (enGrid.classList.contains("layout-leftleft1col")) {
        //   removeClassesByPrefix(enGrid, "layout-");
        //   enGrid.classList.add("layout-centerleft1col");
        // } else if (enGrid.classList.contains("layout-centerleft1col")) {
        //   removeClassesByPrefix(enGrid, "layout-");
        //   enGrid.classList.add("layout-centercenter1col");
        // } else if (enGrid.classList.contains("layout-centercenter1col")) {
        //   removeClassesByPrefix(enGrid, "layout-");
        //   enGrid.classList.add("layout-centercenter2col");
        // } else if (enGrid.classList.contains("layout-centercenter2col")) {
        //   removeClassesByPrefix(enGrid, "layout-");
        //   enGrid.classList.add("layout-debug");
        // } else if (enGrid.classList.contains("layout-debug")) {
        //   removeClassesByPrefix(enGrid, "layout-");
        //   enGrid.classList.add("layout-leftleft1col");
        // } else {
        //   console.log("While trying to switch layouts, something unexpected happen.");
        // }
        if (enGrid.classList.contains("layout-leftleft1col")) {
          removeClassesByPrefix(enGrid, "layout-");
          enGrid.classList.add("layout-centercenter1col");
        } else if (enGrid.classList.contains("layout-centercenter1col")) {
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

export const inputPlaceholder = () => {
  const enGridFloatLabels = document.querySelector("#engrid:not(.float-labels)") as HTMLElement;
  if (enGridFloatLabels) {
    const enFieldDonationAmt = document.querySelector(".en__field--donationAmt.en__field--withOther .en__field__input--other") as HTMLInputElement;
    // const enFieldFirstName = document.querySelector("#en__field_supporter_firstName") as HTMLInputElement;
    // const enFieldLastName = document.querySelector("#en__field_supporter_lastName") as HTMLInputElement;
    // const enFieldEmailAddress = document.querySelector("#en__field_supporter_emailAddress") as HTMLInputElement;
    // const enFieldPhoneNumber = document.querySelector("#en__field_supporter_phoneNumber") as HTMLInputElement;
    const enFieldPhoneNumber2 = document.querySelector("#en__field_supporter_phoneNumber2") as HTMLInputElement;
    // const enFieldCountry = document.querySelector("#en__field_supporter_country") as HTMLSelectElement;
    // const enFieldAddress1 = document.querySelector("#en__field_supporter_address1") as HTMLInputElement;
    // const enFieldAddress2 = document.querySelector("#en__field_supporter_address2") as HTMLInputElement;
    // const enFieldCity = document.querySelector("#en__field_supporter_city") as HTMLInputElement;
    // const enFieldRegion = document.querySelector("#en__field_supporter_region") as HTMLSelectElement;
    // const enFieldPostcode = document.querySelector("#en__field_supporter_postcode") as HTMLInputElement;
    const enFieldHonname = document.querySelector("#en__field_transaction_honname") as HTMLInputElement;
    const enFieldInfname = document.querySelector("#en__field_transaction_infname") as HTMLInputElement;
    const enFieldInfemail = document.querySelector("#en__field_transaction_infemail") as HTMLInputElement;
    // const enFieldInfcountry = document.querySelector("#en__field_transaction_infcountry") as HTMLSelectElement;
    const enFieldInfadd1 = document.querySelector("#en__field_transaction_infadd1") as HTMLInputElement;
    const enFieldInfadd2 = document.querySelector("#en__field_transaction_infadd2") as HTMLInputElement;
    const enFieldInfcity = document.querySelector("#en__field_transaction_infcity") as HTMLInputElement;
    // const enFieldInfreg = document.querySelector("#en__field_transaction_infreg") as HTMLSelectElement;
    const enFieldInfpostcd = document.querySelector("#en__field_transaction_infpostcd") as HTMLInputElement;
    const enFieldGftrsn = document.querySelector("#en__field_transaction_gftrsn") as HTMLInputElement;
    // const enPaymentType = document.querySelector("#en__field_transaction_paymenttype") as HTMLInputElement;
    const enFieldCcnumber = document.querySelector("#en__field_transaction_ccnumber") as HTMLInputElement;
    // const enFieldCcexpire = document.querySelector("#en__field_transaction_ccexpire") as HTMLInputElement;
    // const enFieldCcvv = document.querySelector("#en__field_transaction_ccvv") as HTMLInputElement;
    // const enFieldBankAccountNumber = document.querySelector("#en__field_supporter_bankAccountNumber") as HTMLInputElement;
    // const enFieldBankRoutingNumber = document.querySelector("#en__field_supporter_bankRoutingNumber") as HTMLInputElement;

    if (enFieldDonationAmt) {
      enFieldDonationAmt.placeholder = "Other";
      enFieldDonationAmt.setAttribute("type", "number");
    }
    // if (enFieldFirstName) {
    //   enFieldFirstName.placeholder = "First name";
    // }
    // if (enFieldLastName) {
    //   enFieldLastName.placeholder = "Last name";
    // }
    // if (enFieldEmailAddress) {
    //   enFieldEmailAddress.placeholder = "Email address";
    // }
    // if (enFieldPhoneNumber) {
    //   enFieldPhoneNumber.placeholder = "Phone number";
    // }
    if (enFieldPhoneNumber2) {
      enFieldPhoneNumber2.placeholder = "000-000-0000 (optional)";
    }
    // if (enFieldCountry){
    //   enFieldCountry.placeholder = "Country";
    // // }
    // if (enFieldAddress1) {
    //   enFieldAddress1.placeholder = "Street address";
    // }
    // if (enFieldAddress2) {
    //   enFieldAddress2.placeholder = "Apt., ste., bldg.";
    // }
    // if (enFieldCity) {
    //   enFieldCity.placeholder = "City";
    // }
    // if (enFieldRegion){
    //   enFieldRegion.placeholder = "TBD";
    // }
    // if (enFieldPostcode) {
    //   enFieldPostcode.placeholder = "Post code";
    // }
    if (enFieldHonname) {
      enFieldHonname.placeholder = "Honoree name";
    }
    if (enFieldInfname) {
      enFieldInfname.placeholder = "Recipient name";
    }
    if (enFieldInfemail) {
      enFieldInfemail.placeholder = "Recipient email address";
    }
    // if (enFieldInfcountry){
    //   enFieldInfcountry.placeholder = "TBD";
    // }
    if (enFieldInfadd1) {
      enFieldInfadd1.placeholder = "Recipient street address";
    }
    if (enFieldInfadd2) {
      enFieldInfadd2.placeholder = "Recipient Apt., ste., bldg.";
    }
    if (enFieldInfcity) {
      enFieldInfcity.placeholder = "Recipient city";
    }
    // if (enFieldInfreg){
    //   enFieldInfreg.placeholder = "TBD";
    // }
    if (enFieldInfpostcd) {
      enFieldInfpostcd.placeholder = "Recipient postal code";
    }
    if (enFieldGftrsn) {
      enFieldGftrsn.placeholder = "Reason for your gift";
    }
    // if (enPaymentType) {
    //   enPaymentType.placeholder = "TBD";
    // }
    if (enFieldCcnumber) {
      enFieldCcnumber.placeholder = "•••• •••• •••• ••••";
    }
    // if (enFieldCcexpire) {
    //   enFieldCcexpire.placeholder = "MM / YY";
    // }
    // if (enFieldCcvv) {
    //   enFieldCcvv.placeholder = "CVV";
    // }
    // if (enFieldBankAccountNumber) {
    //   enFieldBankAccountNumber.placeholder = "Bank account number";
    // }
    // if (enFieldBankRoutingNumber) {
    //   enFieldBankRoutingNumber.placeholder = "Bank routing number";
    // }
  }
};
