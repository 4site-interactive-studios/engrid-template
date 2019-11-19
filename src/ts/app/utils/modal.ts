import * as cookie from "./cookie";
import { amount } from "../index";
import { frequency } from "../index";
export default class Modal {
  public debug: boolean = false;
  private overlay: HTMLDivElement;
  private upsellModal: HTMLElement | null;
  private exitModal: HTMLElement | null;

  constructor() {
    this.upsellModal = document.getElementById("upsellModal");
    this.exitModal = document.getElementById("exitModal");
    const markup = `
    <div class="enModal-container">
        <a href="#" class="button-close"></a>
        <div id="enModalContent">
        </div>
    </div>`;
    let overlay = document.createElement("div");
    overlay.id = "enModal";
    overlay.classList.add("is-hidden");
    overlay.innerHTML = markup;
    const closeButton = overlay.querySelector(
      ".button-close"
    ) as HTMLLinkElement;
    closeButton.addEventListener("click", this.close.bind(this));
    document.addEventListener("keyup", e => {
      if (e.key === "Escape") {
        closeButton.click();
      }
    });
    this.overlay = overlay;
    document.body.appendChild(overlay);

    if (this.upsellModal) {
      window.setTimeout(this.open.bind(this, this.upsellModal), 2000);
    }
    if (this.exitModal) {
      document.addEventListener("mouseout", (evt: any) => {
        if (evt.toElement === null && evt.relatedTarget === null) {
          // An intent to exit has happene
          this.open(this.exitModal);
        }
      });
    }
  }
  private open(modal: HTMLElement | null) {
    // If we can't find modal, get out
    if (!modal) return;
    const hideModal = cookie.get("hide_" + modal.id); // Get cookie
    // If we have a cooki AND no Debug, get out
    if (hideModal && !this.debug) return;
    const overlayContent = this.overlay.querySelector(
      "#enModalContent"
    ) as HTMLDivElement;
    // Remove all classes from Overlay
    this.overlay.classList.remove("exitModal", "upsellModal");
    // Add current Modal Id to Overlay as Class
    this.overlay.classList.add(modal.id);
    // Add modal content to overlay
    overlayContent.innerHTML = modal.innerHTML;
    // Load Values
    amount.load();
    frequency.load();
    // Show Modal
    this.overlay.classList.remove("is-hidden");
  }
  private close(e: Event) {
    e.preventDefault();
    if (this.overlay.classList.contains("exitModal")) {
      cookie.set("hide_exitModal", "1", { expires: 1 }); // Create one day cookie
    } else {
      cookie.set("hide_upsellModal", "1", { expires: 1 }); // Create one day cookie
    }
    this.overlay.classList.add("is-hidden");
  }
}
