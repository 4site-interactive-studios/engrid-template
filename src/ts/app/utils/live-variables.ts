import DonationAmount from "../events/donation-amount";
import DonationFrequency from "../events/donation-frequency";

import { amount } from "../index";
import { frequency } from "../index";
import { form } from "../index";

export default class LiveVariables {
  public _amount: DonationAmount;
  private _frequency: DonationFrequency;

  constructor() {
    this._amount = amount;
    this._frequency = frequency;
    amount.onAmountChange.subscribe(() => this.changeSubmitButton());
    amount.onAmountChange.subscribe(() => this.changeLiveAmount());
    amount.onAmountChange.subscribe(() => this.changeLiveUpsellAmount());
    frequency.onFrequencyChange.subscribe(() => this.changeLiveFrequency());
    frequency.onFrequencyChange.subscribe(() => this.changeSubmitButton());
    form.onSubmit.subscribe(() => this.loadingSubmitButton());
    form.onError.subscribe(() => this.changeSubmitButton());
  }

  private getAmountTxt(amount: number = 0) {
    const amountTxt = Number.isInteger(amount)
      ? "$" + amount
      : "$" + amount.toFixed(2);
    return amount > 0 ? amountTxt : "";
  }

  private getUpsellAmountTxt(amount: number = 0) {
    const amountTxt = "$" + Math.ceil(amount / 5) * 5;
    return amount > 0 ? amountTxt : "";
  }

  public changeSubmitButton() {
    const submit = document.querySelector(
      ".en__submit button"
    ) as HTMLButtonElement;
    const amount = this.getAmountTxt(this._amount.amount);

    const frequency = this._frequency.frequency == "single" ? "" : " Monthly";
    const label = amount != "" ? "Donate " + amount + frequency : "Donate Now";
    submit.innerHTML = label;
  }
  public loadingSubmitButton() {
    const submit = document.querySelector(
      ".en__submit button"
    ) as HTMLButtonElement;
    let submitButtonOriginalHTML = submit.innerHTML as string;
    let submitButtonProcessingHTML = ("<span class='loader-wrapper'><span class='loader loader-quart'></span><span class='submit-button-text-wrapper'>" +
      submitButtonOriginalHTML +
      "</span></span>") as string;
    submitButtonOriginalHTML = submit.innerHTML;
    submit.innerHTML = submitButtonProcessingHTML;
    return true;
  }

  public changeLiveAmount() {
    const live_amount = document.querySelectorAll(".live-giving-amount");
    live_amount.forEach(
      elem => (elem.innerHTML = this.getAmountTxt(this._amount.amount))
    );
  }

  public changeLiveUpsellAmount() {
    const live_upsell_amount = document.querySelectorAll(
      ".live-giving-upsell-amount"
    );
    const multiplier = 1 / 12;
    live_upsell_amount.forEach(
      elem =>
        (elem.innerHTML = this.getUpsellAmountTxt(
          this._amount.amount * multiplier
        ))
    );
  }
  public changeLiveFrequency() {
    const live_frequency = document.querySelectorAll(".live-giving-frequency");
    live_frequency.forEach(
      elem =>
        (elem.innerHTML =
          this._frequency.frequency == "single" ? "" : "monthly")
    );
  }
}
