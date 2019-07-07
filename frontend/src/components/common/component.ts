import * as React from 'react'
import { Subscription } from 'rxjs'

export class Component<Props, State> extends React.Component<Props, State> {

  private _subscriptions: Subscription[] = []

  protected handleSubscriptions(subscriptions: Subscription[]) {
    this._subscriptions.push(...subscriptions)
  }

  componentWillUnmount() {
    this._subscriptions.forEach(
      subscription => subscription.unsubscribe()
    )
  }

}