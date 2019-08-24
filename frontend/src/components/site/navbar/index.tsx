import './style.scss';
import app from 'lib/app';
import * as React from 'react';
import { Computer } from '@lunchbox-lambda/client';
import { Component } from 'components/common';
import { ConnectivityIconsComponent } from 'components/common';

interface Props { }

interface State {
  computer: Computer;
}

const logo = require('assets/logo_white.svg');

export class Navbar extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      computer: null,
    };
  }

  public componentDidMount() {
    this.handleSubscriptions([

      app.store.getComputer()
        .subscribe((computer) => this.setState({ computer })),
    ]);
  }

  public render() {
    return <nav className="pt-navbar pt-dark">
      <div className="pt-navbar-group pt-align-left">
        <div className="pt-navbar-heading" style={ { margin: '0px' } }>
          <div style={ { display: 'flex', alignItems: 'center' } }>
            <img src={ logo } style={ { height: '20px' } }></img>
          </div>
        </div>
        <span className="pt-navbar-divider"></span>
        {
          !this.state.computer ? null :
            <span>{ `v${this.state.computer.version}` }</span>
        }
        <span className="pt-navbar-divider"></span>
        {
          !this.state.computer ? null :
            <span>{ this.state.computer.name }</span>
        }
      </div>
      <div className="pt-navbar-group pt-align-right">
        <ConnectivityIconsComponent />
      </div>
    </nav>;
  }
}
