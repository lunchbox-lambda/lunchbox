import { Intent, Position, Toaster as _Toaster } from '@blueprintjs/core'

export class Toaster {

  static _toaster = _Toaster.create({
    position: Position.TOP_RIGHT
  })

  static info(message: string) {
    Toaster._toaster.show({
      message,
      intent: Intent.PRIMARY
    })
  }

  static success(message: string) {
    Toaster._toaster.show({
      message,
      intent: Intent.SUCCESS
    })
  }

  static warning(message: string) {
    Toaster._toaster.show({
      message,
      intent: Intent.WARNING
    })
  }

  static error(error: Error) {
    Toaster._toaster.show({
      message: error.message,
      intent: Intent.DANGER
    })
  }

}
