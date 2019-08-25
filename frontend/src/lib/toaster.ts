import { Intent, Position, Toaster as _Toaster } from '@blueprintjs/core';

export default class Toaster {
  public static _toaster = _Toaster.create({
    position: Position.TOP_RIGHT,
  })

  public static info(message: string) {
    Toaster._toaster.show({
      message,
      intent: Intent.PRIMARY,
    });
  }

  public static success(message: string) {
    Toaster._toaster.show({
      message,
      intent: Intent.SUCCESS,
    });
  }

  public static warning(message: string) {
    Toaster._toaster.show({
      message,
      intent: Intent.WARNING,
    });
  }

  public static error(error: Error) {
    Toaster._toaster.show({
      message: error.message,
      intent: Intent.DANGER,
    });
  }
}
