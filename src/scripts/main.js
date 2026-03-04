export const customScript = function (App) {
  console.log("ENGrid client scripts are executing");
  // Add your client scripts here

  App.setBodyData("client-js-loading", "finished");
};
