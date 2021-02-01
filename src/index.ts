import { DonationAmount, DonationFrequency, EnForm, ProcessingFees } from '@4site/engrid-events';
import { ApplePay, CapitalizeFields, ClickToExpand, engrid, getUrlParameter, IE, LiveVariables, Modal, sendIframeHeight, ShowHideRadioCheckboxes, SimpleCountrySelect } from '@4site/engrid-common';

// IE Warning
const ie = new IE();



export const amount = DonationAmount.getInstance(
  "transaction.donationAmt",
  "transaction.donationAmt.other"
);
export const frequency = DonationFrequency.getInstance("transaction.recurrpay");
export const form = EnForm.getInstance();

// Processing Fees Event
export const fees = ProcessingFees.getInstance();

export const run = (opts: Object) => {
  const options = {
    ...{
      backgroundImage: "auto",
      submitLabel: "Donate",
    },
    ...opts,
  };
  // The entire App
  engrid.setBackgroundImages(options.backgroundImage);

  engrid.inputPlaceholder();
  engrid.watchInmemField();
  engrid.watchRecurrpayField();
  engrid.watchGiveBySelectField();
  engrid.watchLegacyGiveBySelectField();
  engrid.SetEnFieldOtherAmountRadioStepValue();
  engrid.simpleUnsubscribe();

  engrid.contactDetailLabels();
  engrid.easyEdit();
  engrid.enInput.init();

  new ShowHideRadioCheckboxes("transaction.giveBySelect", "giveBySelect-");
  new ShowHideRadioCheckboxes("supporter.questions.180165", "giveBySelect-");
  new ShowHideRadioCheckboxes("transaction.inmem", "inmem-");
  new ShowHideRadioCheckboxes("transaction.recurrpay", "recurrpay-");

  // Controls if the Theme has a the "Debug Bar"
  // engrid.debugBar();

  // Event Listener Examples
  amount.onAmountChange.subscribe((s) => console.log(`Live Amount: ${s}`));
  frequency.onFrequencyChange.subscribe((s) =>
    console.log(`Live Frequency: ${s}`)
  );
  form.onSubmit.subscribe((s) => console.log('Submit: ', s));
  form.onError.subscribe((s) => console.log('Error:', s));

  window.enOnSubmit = function () {
    form.dispatchSubmit();
    return form.submit;
  };
  window.enOnError = function () {
    form.dispatchError();
  };

  // Iframe Code Start
  const inIframe = () => {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  };
  if (inIframe()) {
    var enID = getUrlParameter('en_id');

    // Add the data-engrid-embedded attribute when inside an iFrame if it wasn't already added by a script in the Page Template
    document.body.setAttribute("data-engrid-embedded", "");

    const shouldScroll = () => {
      // If you find a error, scroll
      if (document.querySelector('.en__errorHeader')) {
        return true;
      }
      // Try to match the iframe referrer URL by testing valid EN Page URLs
      let referrer = document.referrer;
      let enURLPattern = new RegExp(/^(.*)\/(page)\/(\d+.*)/);

      // Scroll if the Regex matches, don't scroll otherwise
      return enURLPattern.test(referrer);
    }

    // Fire the resize event
    console.log("iFrame Event - First Resize");
    sendIframeHeight(enID);

    // On load fire scroll behavior
    window.onload = () => {
      // Scroll to top of iFrame
      console.log("iFrame Event - window.onload");
      sendIframeHeight(enID);
      window.parent.postMessage(
        {
          scroll: shouldScroll(),
          enID: enID
        },
        "*"
      );

      // On click fire the resize event
      document.addEventListener("click", (e: Event) => {
        console.log("iFrame Event - click");
        setTimeout(() => {
          sendIframeHeight(enID);
        }, 100);
      });
    };

    // On resize fire the resize event
    window.onresize = () => {
      console.log("iFrame Event - window.onload");
      sendIframeHeight(enID);
    }
    // Change the layout class to embedded
    // const gridElement = document.getElementById("engrid") || document.body as HTMLElement;
    // @TODO We need to write a better way of stripping layout classes 

    // gridElement.classList.add("layout-embedded");
    // gridElement.classList.remove("layout-centerleft1col");
    // gridElement.classList.remove("layout-centercenter1col");
    // gridElement.classList.remove("layout-centerright1col");
    // gridElement.classList.remove("layout-centercenter1col-wide");

  }
  // Iframe Code End

  // Live Variables
  new LiveVariables(options.submitLabel);

  // Modal
  const modal = new Modal();
  modal.debug = true; // Comment it out to disable debug

  // On the end of the script, after all subscribers defined, let's load the current value
  amount.load();
  frequency.load();

  // Simple Country Select
  const simpleCountrySelect = new SimpleCountrySelect();
  const applePay = new ApplePay();
  new CapitalizeFields();
  new ClickToExpand();
};
