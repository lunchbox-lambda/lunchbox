import * as React from 'react'
import { FocusStyleManager } from '@blueprintjs/core'
import { Site } from 'components/site'

interface Props { }

interface State { }

export class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
  }

  componentDidMount() {

  }

  render() {
    FocusStyleManager.onlyShowFocusOnTabs()
    return <Site />
  }

}