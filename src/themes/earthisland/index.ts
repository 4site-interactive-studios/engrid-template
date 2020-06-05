import { run } from "../../ts/app";
import "./sass/main.scss";

const options = {
  // backgroundImage: [
  //   "https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10069/earthisland-background.jpg"
  // ],
  submitLabel: "Give"
};

if (document.readyState !== "loading") {
  run(options);
} else {
  document.addEventListener("DOMContentLoaded", function() {
    run(options);
  });
}
