import { SimpleEventDispatcher } from "strongly-typed-events";

export default class DonationAmount {
  private _onAmountChange = new SimpleEventDispatcher<number>();
  private _amount: number = 0;
  private _radios: string = "";
  private _other: string = "";

  constructor(radios: string, other: string) {
    this._other = other;
    this._radios = radios;
    // Watch the Radios for Changes
    document.addEventListener("change", (e: Event) => {
      const element = e.target as HTMLInputElement;
      if (element && (element.name == radios || element.name == other)) {
        this.amount = parseFloat(element.value);
      }
    });
  }

  get amount(): number {
    return this._amount;
  }

  // Every time we set an amount, trigger the onAmountChange event
  set amount(value: number) {
    this._amount = value || 0;
    this._onAmountChange.dispatch(this._amount);
  }

  public get onAmountChange() {
    return this._onAmountChange.asEvent();
  }

  // Set amount var with currently selected amount
  public load() {
    const currentAmountField = document.querySelector(
      'input[name="' + this._radios + '"]:checked'
    ) as HTMLInputElement;
    let currentAmountValue = parseFloat(currentAmountField.value);
    if (currentAmountValue > 0) {
      this.amount = parseFloat(currentAmountField.value);
    } else {
      const otherField = document.querySelector(
        'input[name="' + this._other + '"]'
      ) as HTMLInputElement;
      currentAmountValue = parseFloat(otherField.value);
      this.amount = parseFloat(otherField.value);
    }
  }
}
