import app from 'lib/app';
import * as React from 'react';
import { Component } from 'components/common';
import { Connectivity } from '@lunchbox-lambda/client';
import { Spinner, Intent } from '@blueprintjs/core';

interface Props { }

interface State {
  connectivity: Connectivity;
}

export class ConnectivitySpinnerComponent extends Component<Props, State> {
  public constructor(props) {
    super(props);

    this.state = {
      connectivity: {
        broker: null,
        board: null,
        socket: null,
      },
    };
  }

  public componentDidMount() {
    this.handleSubscriptions([

      app.store.getConnectivity()
        .subscribe((connectivity) => this.setState({ connectivity })),
    ]);
  }

  public render() {
    const { connectivity } = this.state;

    return (
      connectivity.socket === true ? null :
        <div style={ {
          position: 'absolute',
          backgroundColor: 'rgba(255,255,255,0.8)',
          width: '100%',
          height: '100%',
          zIndex: 999,
          margin: '-15px',
          textAlign: 'center',
          padding: '150px',
        } }>
          <Spinner className="pt-large" intent={ Intent.PRIMARY } />
        </div>
    );
  }
}
