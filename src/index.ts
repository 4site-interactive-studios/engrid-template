import { Options, App } from "@4site/engrid-common"; // Uses ENGrid via NPM
// import { Options, App } from "../../engrid-scripts/packages/common"; // Uses ENGrid via Visual Studio Workspace

document
  .getElementsByTagName("body")[0]
  .setAttribute("data-engrid-client-js-loading", "started");

import "./sass/main.scss";
import { customScript } from "./scripts/main";

const options: Options = {
  applePay: false,
  CapitalizeFields: true,
  ClickToExpand: true,
  CurrencySymbol: "$",
  DecimalSeparator: ".",
  ThousandsSeparator: ",",
  MediaAttribution: true,
  SkipToMainContentLink: true,
  SrcDefer: true,
  ProgressBar: true,
  Debug: App.getUrlParameter("debug") == "true" ? true : false,
  onLoad: () => customScript(),
  onResize: () => console.log("Starter Theme Window Resized"),
};
new App(options);

document
  .getElementsByTagName("body")[0]
  .setAttribute("data-engrid-client-js-loading", "finished");
