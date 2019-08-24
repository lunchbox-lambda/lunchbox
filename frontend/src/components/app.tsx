import * as React from 'react';
import { FocusStyleManager } from '@blueprintjs/core';
import { Site } from 'components/site';

interface Props { }

interface State { }

export class App extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  public componentDidMount() {

  }

  public render() {
    FocusStyleManager.onlyShowFocusOnTabs();
    return <Site />;
  }
}
