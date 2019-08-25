import './style.scss';
import app from 'lib/app';
import * as React from 'react';
import Component from 'components/common/component';
import { Connectivity } from '@lunchbox-lambda/client';

interface Props { }

interface State {
  connectivity: Connectivity;
}

export default class ConnectivityIconsComponent extends Component<Props, State> {
  private items = {
    broker: { icon: 'fa-database' },
    board: { icon: 'fa-microchip' },
    socket: { icon: 'fa-exchange-alt' },
  }

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
      <div className="connectivity-icons">
        {
          Object.keys(connectivity).map((key) =>
            <span
              key={ key }
              className="fa-layers fa-fw fa-lg"
              style={ { opacity: connectivity[key] === null ? 0.3 : 1.0 } }
            >
              <i className={ `fas ${this.items[key].icon}` }></i>
              {
                connectivity[key] !== false ? null :
                  <span>
                    <i
                      className="fas fa-times"
                      data-fa-transform="grow-8">
                    </i>
                  </span>
              }
            </span>,
          )
        }
      </div>
    );
  }
}
