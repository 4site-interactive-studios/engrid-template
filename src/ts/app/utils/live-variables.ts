import DonationAmount from "../events/donation-amount";
import DonationFrequency from "../events/donation-frequency";

import { amount } from "../index";
import { frequency } from "../index";
import { form } from "../index";
import { fromStringWithSourceMap } from "source-list-map";

export default class LiveVariables {
  public _amount: DonationAmount;
  private _frequency: DonationFrequency;
  private multiplier: number = 1 / 12;

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

    // Watch the monthly-upsell links
    document.addEventListener("click", (e: Event) => {
      const element = e.target as HTMLInputElement;
      if (element) {
        if (element.classList.contains("monthly-upsell")) {
          this.upsold(e);
        } else if (element.classList.contains("form-submit")) {
          form.submitForm();
        }
      }
    });
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

  private getUpsellAmountRaw(amount: number = 0) {
    const amountRaw = Math.ceil(amount / 5) * 5;
    return amount > 0 ? amountRaw.toString() : "";
  }

  public changeSubmitButton() {
    const submit = document.querySelector(
      ".en__submit button"
    ) as HTMLButtonElement;
    const amount = this.getAmountTxt(this._amount.amount);

    if (amount) {
      const frequency = this._frequency.frequency == "single" ? "" : " Monthly";
      const label =
        amount != "" ? "Donate " + amount + frequency : "Donate Now";
      submit.innerHTML = label;
    }
  }
  public loadingSubmitButton() {
    const submit = document.querySelector(
      ".en__submit button"
    ) as HTMLButtonElement;
    let submitButtonOriginalHTML = submit.innerHTML;
    let submitButtonProcessingHTML =
      "<span class='loader-wrapper'><span class='loader loader-quart'></span><span class='submit-button-text-wrapper'>" +
      submitButtonOriginalHTML +
      "</span></span>";
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

    live_upsell_amount.forEach(
      elem =>
        (elem.innerHTML = this.getUpsellAmountTxt(
          this._amount.amount * this.multiplier
        ))
    );

    const live_upsell_amount_raw = document.querySelectorAll(
      ".live-giving-upsell-amount-raw"
    );
    live_upsell_amount_raw.forEach(
      elem =>
        (elem.innerHTML = this.getUpsellAmountRaw(
          this._amount.amount * this.multiplier
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

  // Watch for a clicks on monthly-upsell link
  private upsold(e: Event) {
    // Find and select monthly giving
    const enFieldRecurrpay = document.querySelector(
      ".en__field--recurrpay input[value='Y']"
    ) as HTMLInputElement;
    if (enFieldRecurrpay) {
      enFieldRecurrpay.checked = true;
    }

    // Find the hidden radio select that needs to be selected when entering an "Other" amount
    const enFieldOtherAmountRadio = document.querySelector(
      ".en__field--donationAmt input[value='other']"
    ) as HTMLInputElement;
    if (enFieldOtherAmountRadio) {
      enFieldOtherAmountRadio.checked = true;
    }

    // Enter the other amount and remove the "en__field__item--hidden" class from the input's parent
    const enFieldOtherAmount = document.querySelector(
      "input[name='transaction.donationAmt.other']"
    ) as HTMLInputElement;
    if (enFieldOtherAmount) {
      // @TODO Needs to use getUpsellAmountRaw to set value

      enFieldOtherAmount.value = this.getUpsellAmountRaw(
        this._amount.amount * this.multiplier
      );
      amount.load();
      frequency.load();
      if (enFieldOtherAmount.parentElement) {
        enFieldOtherAmount.parentElement.classList.remove(
          "en__field__item--hidden"
        );
      }
    }

    const target = e.target as HTMLLinkElement;
    if (target && target.classList.contains("form-submit")) {
      // Form submit
      form.submitForm();
    }
  }
}
