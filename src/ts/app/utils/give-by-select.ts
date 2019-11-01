export default class GiveBySelect {
  // All Affected Radio Elements
  public elements: NodeList = document.getElementsByName(
    "transaction.giveBySelect"
  );
  // Class used on Show/Hide Divs + Radio Value
  public classes: String = "give-by-";

  // Hide All Divs
  hideAll() {
    this.elements.forEach((item, index) => {
      if (item instanceof HTMLInputElement) this.hide(item);
    });
  }
  // Hide Single Element Div
  hide(item: HTMLInputElement) {
    let inputValue = item.value;
    document.querySelectorAll("." + this.classes + inputValue).forEach(el => {
      if (el instanceof HTMLElement) el.style.display = "none";
    });
  }
  // Show Single Element Div
  show(item: HTMLInputElement) {
    let inputValue = item.value;
    document.querySelectorAll("." + this.classes + inputValue).forEach(el => {
      if (el instanceof HTMLElement) el.style.display = "block";
    });
  }

  constructor() {
    this.hideAll();
    for (let i = 0; i < this.elements.length; i++) {
      let element = <HTMLInputElement>this.elements[i];
      if (element.checked) {
        this.hideAll();
        this.show(element);
      }
      element.addEventListener("change", (e: Event) => {
        this.hideAll();
        this.show(element);
      });
    }
  }
}
