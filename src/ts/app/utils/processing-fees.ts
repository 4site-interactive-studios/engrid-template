import DonationAmount from "../events/donation-amount";

import { amount } from "../index";
import { form } from "../index";

export default class ProcessingFees {
  public _amount: DonationAmount = amount;

  constructor() {
    // this._amount = amount;
    form.onSubmit.subscribe(() => this.addFees());
  }

  // Add Fees to Amount
  private addFees() {
    const fees = document.querySelector(
      'input[name="supporter.processing_fees"]'
    ) as HTMLInputElement;
    if (fees && fees.checked) {
      const processing_fee = (parseInt(fees.value) / 100) * this._amount.amount;
      this._amount.setAmount(this._amount.amount + processing_fee);
    }
  }
  // Remove Fees From Amount
  private removeFees() {
    const fees = document.querySelector(
      'input[name="supporter.processing_fees"]'
    ) as HTMLInputElement;
    if (fees && fees.checked) {
      const processing_fee = (parseInt(fees.value) / 100) * this._amount.amount;
      this._amount.setAmount(this._amount.amount - processing_fee);
    }
  }
}
