import * as app from "./utils/custom-methods";
import ShowHideRadioCheckboxes from "./utils/show-hide-radio-checkboxes";
export const run = () => {
  // The entire App
  app.body.classList.remove("loading");
  app.body.classList.add("loaded");
  app.setBackgroundImages();

  app.inputPlaceholder();
  // app.watchInmemField();
  // app.watchRecurrpayField();
  // app.watchGiveBySelectField();
  // app.watchLegacyGiveBySelectField();

  app.contactDetailLabels();
  app.easyEdit();
  app.enInput.init();

  new ShowHideRadioCheckboxes("transaction.giveBySelect", "giveBySelect-");
  new ShowHideRadioCheckboxes("supporter.questions.180165", "giveBySelect-");
  new ShowHideRadioCheckboxes("transaction.inmem", "inmem-");
  new ShowHideRadioCheckboxes("transaction.recurrpay", "recurrpay-");
  app.debugBar();
};
