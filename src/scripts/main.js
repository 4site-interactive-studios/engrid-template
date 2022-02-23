export const customScript = function () {
  console.log("ENGrid client scripts are executing");
  // Add your client scripts here

  App.setBodydata("client-js-loading", "finished");
};
