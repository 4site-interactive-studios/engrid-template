import * as app from "./utils/custom-methods";
import ShowHideRadioCheckboxes from "./utils/show-hide-radio-checkboxes";
import DonationAmount from "./events/donation-amount";
import DonationFrequency from "./events/donation-frequency";
import LiveVariables from "./utils/live-variables";

export const run = () => {
  // Event Classes
  let amount = new DonationAmount(
    "transaction.donationAmt",
    "transaction.donationAmt.other"
  );
  let frequency = new DonationFrequency("transaction.recurrpay");
  // The entire App
  app.setBackgroundImages();

  app.inputPlaceholder();
  app.watchInmemField();
  app.watchRecurrpayField();
  app.watchGiveBySelectField();
  app.watchLegacyGiveBySelectField();

  app.contactDetailLabels();
  app.easyEdit();
  app.enInput.init();

  new ShowHideRadioCheckboxes("transaction.giveBySelect", "giveBySelect-");
  new ShowHideRadioCheckboxes("supporter.questions.180165", "giveBySelect-");
  new ShowHideRadioCheckboxes("transaction.inmem", "inmem-");
  new ShowHideRadioCheckboxes("transaction.recurrpay", "recurrpay-");

  app.onFormSubmitSubmitButtonUpdate();
  app.debugBar();

  // Event Listener Examples
  amount.onAmountChange.subscribe(s => console.log(`Amount: ${s}`));
  frequency.onFrequencyChange.subscribe(s => console.log(`Frequency: ${s}`));

  // Live Variables
  new LiveVariables(amount, frequency);

  // On the end of the script, after all subscribers defined, let's load the current value
  amount.load();
  frequency.load();
};
