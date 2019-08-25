import * as React from 'react';
import { FocusStyleManager } from '@blueprintjs/core';
import Site from 'components/site';

interface Props { }

interface State { }

export default class App extends React.Component<Props, State> {
  public componentDidMount() { }

  public render() {
    FocusStyleManager.onlyShowFocusOnTabs();
    return <Site />;
  }
}
