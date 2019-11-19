import { SignalDispatcher } from "strongly-typed-events";

export default class DonationForm {
  private _onSubmit = new SignalDispatcher();
  private _onError = new SignalDispatcher();

  public dispatchSubmit() {
    this._onSubmit.dispatch();
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
