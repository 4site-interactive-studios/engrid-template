import { Options, App } from "@4site/engrid-scripts"; // Uses ENGrid via NPM
// import { Options, App } from "../../engrid-scripts/packages/common"; // Uses ENGrid via Visual Studio Workspace

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
