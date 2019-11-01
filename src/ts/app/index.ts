import * as app from "./utils/custom-methods";
import GiveBySelect from "./utils/give-by-select";
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
  app.enInput.init();

  new GiveBySelect();
  app.debugBar();
};
