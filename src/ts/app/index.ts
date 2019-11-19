import * as app from "./utils/custom-methods";
import ShowHideRadioCheckboxes from "./utils/show-hide-radio-checkboxes";
import DonationAmount from "./events/donation-amount";
import DonationFrequency from "./events/donation-frequency";
import DonationForm from "./events/donation-form";
import LiveVariables from "./utils/live-variables";
import Modal from "./utils/modal";

export const amount = new DonationAmount(
  "transaction.donationAmt",
  "transaction.donationAmt.other"
);
export const frequency = new DonationFrequency("transaction.recurrpay");
export const form = new DonationForm();

export const run = () => {
  // The entire App
  app.setBackgroundImages();

  app.inputPlaceholder();
  app.watchInmemField();
  app.watchRecurrpayField();
  app.watchGiveBySelectField();
  app.watchLegacyGiveBySelectField();
  app.monthlyUpsell();

  app.contactDetailLabels();
  app.easyEdit();
  app.enInput.init();

  new ShowHideRadioCheckboxes("transaction.giveBySelect", "giveBySelect-");
  new ShowHideRadioCheckboxes("supporter.questions.180165", "giveBySelect-");
  new ShowHideRadioCheckboxes("transaction.inmem", "inmem-");
  new ShowHideRadioCheckboxes("transaction.recurrpay", "recurrpay-");

  app.debugBar();

  // Event Listener Examples
  amount.onAmountChange.subscribe(s => console.log(`Amount: ${s}`));
  frequency.onFrequencyChange.subscribe(s => console.log(`Frequency: ${s}`));
  form.onSubmit.subscribe(s => console.log(`Submit: ${s}`));
  form.onError.subscribe(s => console.log(`Error: ${s}`));

  window.enOnSubmit = function() {
    form.dispatchSubmit();
    return form.submit;
  };
  window.enOnError = function() {
    form.dispatchError();
  };

  // Live Variables
  new LiveVariables();

  // Modal
  const modal = new Modal();
  modal.debug = true; // Comment it out to disable debug

  // On the end of the script, after all subscribers defined, let's load the current value
  amount.load();
  frequency.load();
};
