import { SignalDispatcher } from "strongly-typed-events";

export default class EnForm {
  private _onSubmit = new SignalDispatcher();
  private _onError = new SignalDispatcher();
  public submit: boolean = true;

  public dispatchSubmit() {
    this._onSubmit.dispatch();
  }

  public dispatchError() {
    this._onError.dispatch();
  }

  public submitForm() {
    const enForm = document.querySelector("form");
    if (enForm) {
      enForm.submit();
    }
  }

  public get onSubmit() {
    return this._onSubmit.asEvent();
  }

  public get onError() {
    return this._onError.asEvent();
  }
}
