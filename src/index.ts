import { run } from "./ts/app";
import "./sass/main.scss";

if (document.readyState !== "loading") {
  run();
} else {
  document.addEventListener("DOMContentLoaded", function() {
    run();
  });
}
