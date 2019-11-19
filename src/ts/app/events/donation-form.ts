import { SignalDispatcher } from "strongly-typed-events";
import { amount } from "../index";
import { frequency } from "../index";

export default class DonationForm {
  private _onSubmit = new SignalDispatcher();
  private _onError = new SignalDispatcher();
  private _submitBtn = document.querySelector(
    ".en__submit button"
  ) as HTMLElement;

  public dispatchSubmit() {
    this._onSubmit.dispatch();

    if (this._submitBtn) {
      return true;
    }
  }
  public dispatchError() {
    this._onError.dispatch();
  }

  public get onSubmit() {
    return this._onSubmit.asEvent();
  }

  public get onError() {
    return this._onError.asEvent();
  }
}
