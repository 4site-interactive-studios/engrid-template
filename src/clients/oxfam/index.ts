import { run } from "../../ts/app";
import "./sass/main.scss";

const options = {
  backgroundImage: [
    "https://apps.4sitestudios.com/clients/oxfam/engrid/background/1.jpg",
    "https://apps.4sitestudios.com/clients/oxfam/engrid/background/2.jpg",
    "https://apps.4sitestudios.com/clients/oxfam/engrid/background/3.jpg",
    "https://apps.4sitestudios.com/clients/oxfam/engrid/background/4.jpg",
    "https://apps.4sitestudios.com/clients/oxfam/engrid/background/5.jpg",
    "https://apps.4sitestudios.com/clients/oxfam/engrid/background/6.jpg",
    "https://apps.4sitestudios.com/clients/oxfam/engrid/background/7.jpg",
    "https://apps.4sitestudios.com/clients/oxfam/engrid/background/8.jpg",
    "https://apps.4sitestudios.com/clients/oxfam/engrid/background/9.jpg",
    "https://apps.4sitestudios.com/clients/oxfam/engrid/background/10.jpg",
    "https://apps.4sitestudios.com/clients/oxfam/engrid/background/11.jpg",
    "https://apps.4sitestudios.com/clients/oxfam/engrid/background/12.jpg",
    "https://apps.4sitestudios.com/clients/oxfam/engrid/background/13.jpg"
  ],
  submitLabel: "Give"
};

if (document.readyState !== "loading") {
  run(options);
} else {
  document.addEventListener("DOMContentLoaded", function() {
    run(options);
  });
}
