import DonationAmount from "./donation-amount";

import { amount } from "../index";
import { form } from "../index";
import { SimpleEventDispatcher } from "strongly-typed-events";

export default class ProcessingFees {
  private _onFeeChange = new SimpleEventDispatcher<number>();
  public _amount: DonationAmount = amount;
  private _fee: number = 0;
  private _field: HTMLInputElement | null = document.querySelector(
    'input[name="supporter.processing_fees"]'
  );

  private _subscribe?: () => void;

  constructor() {
    // Run only if it is a Donation Page with a Donation Amount field
    if (document.getElementsByName("transaction.donationAmt").length) {
      return;
    }
    // Watch the Radios for Changes
    if (this._field instanceof HTMLInputElement) {
      this._field.addEventListener("change", (e: Event) => {
        if (
          this._field instanceof HTMLInputElement &&
          this._field.checked &&
          !this._subscribe
        ) {
          this._subscribe = form.onSubmit.subscribe(() => this.addFees());
        }
        this._onFeeChange.dispatch(this.fee);
      });
    }

    // this._amount = amount;
  }
  public get onFeeChange() {
    return this._onFeeChange.asEvent();
  }
  get fee(): number {
    return this.calculateFees();
  }

  // Every time we set a frequency, trigger the onFrequencyChange event
  set fee(value: number) {
    this._fee = value;
    this._onFeeChange.dispatch(this._fee);
  }

  private calculateFees() {
    if (
      this._field instanceof HTMLInputElement &&
      this._field.checked &&
      "dataset" in this._field
    ) {
      const fees = {
        ...{
          processingFeePercentAdded: "0",
          processingFeeFixedAmountAdded: "0"
        },
        ...this._field.dataset
      };
      const processing_fee =
        (parseFloat(fees.processingFeePercentAdded) / 100) *
          this._amount.amount +
        parseFloat(fees.processingFeeFixedAmountAdded);
      return Math.round(processing_fee * 100) / 100;
    }
    return 0;
  }

  // Add Fees to Amount
  private addFees() {
    if (form.submit) {
      this._amount.setAmount(this._amount.amount + this.fee, false);
    }
  }
  // Remove Fees From Amount
  private removeFees() {
    this._amount.setAmount(this._amount.amount - this.fee);
  }
}
