import { Options, App } from "@4site/engrid-common";
// import { Options, App } from "../../engrid-scripts/packages/common";
import "./sass/main.scss";

const options: Options = {
  backgroundImage: [
    "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2110/default-bg-1.jpg?v=1578587000000",
    "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2110/default-bg-2.jpg?v=1578587000000",
    "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2110/default-bg-3.jpg?v=1578587000000",
    "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2110/default-bg-4.jpg?v=1578587000000",
    "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2110/default-bg-5.jpg?v=1578587000000",
    "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2110/default-bg-6.jpg?v=1578587000000",
    "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2110/default-bg-7.jpg?v=1578587000000",
    "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2110/default-bg-8.jpg?v=1578587000000",
    "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2110/default-bg-9.jpg?v=1578587000000",
    "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2110/default-bg-10.jpg?v=1578587000000",
    "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2110/default-bg-11.jpg?v=1578587000000",
    "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2110/default-bg-12.jpg?v=1578587000000",
    "https://aaf1a18515da0e792f78-c27fdabe952dfc357fe25ebf5c8897ee.ssl.cf5.rackcdn.com/2110/default-bg-13.jpg?v=1578587000000"
  ],
  ModalDebug: true,
  applePay: false,
  CapitalizeFields: false,
  ClickToExpand: true,
  CurrencySymbol: '$',
  CurrencySeparator: '.',
  onLoad: () => console.log("Starter Theme Loaded"),
  onResize: () => console.log("Starter Theme Window Resized")
};
new App(options);