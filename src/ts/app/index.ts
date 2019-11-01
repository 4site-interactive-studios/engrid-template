import * as app from "./utils/custom-methods";
export const run = () => {
  // The entire App
  app.body.classList.remove("loading");
  app.body.classList.add("loaded");
  app.setBackgroundImages();

  app.inputPlaceholder();
  app.watchFieldsForChanges();
  app.enInput.init();

  app.debugBar();
};
