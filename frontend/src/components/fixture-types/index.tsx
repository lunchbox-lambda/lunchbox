import app from 'lib/app';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import Component from 'components/common/component';
import { FixtureType } from '@lunchbox-lambda/client';

interface Props { }

interface State {
  fixtureTypes: FixtureType[];
}

export default class FixtureTypeListComponent extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      fixtureTypes: [],
    };
  }

  public componentDidMount() {
    this.handleSubscriptions([

      app.services.fixtureTypes.query()
        .subscribe((fixtureTypes) => {
          fixtureTypes.sort((a, b) => a.name.localeCompare(b.name));
          this.setState({ fixtureTypes });
        }),
    ]);
  }

  public render() {
    return (
      <div className='content'>
        <h4>Fixture Types</h4>
        <table className='pt-table pt-condensed pt-striped'>
          <thead>
            <tr>
              <th style={ { width: '75px' } }>Type</th>
              <th style={ { width: '200px' } }>Name</th>
              <th>Description</th>
              <th style={ { width: '200px' } }>Input \ Output</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.fixtureTypes.map((fixtureType) =>
                this.renderFixtureTypeRow(fixtureType),
              )
            }
          </tbody>
        </table>
      </div>
    );
  }

  private renderFixtureTypeRow(fixtureType: FixtureType) {
    const { inputs } = fixtureType;
    const { outputs } = fixtureType;

    return (
      <tr key={ fixtureType.id }>
        <td style={ { textAlign: 'center', verticalAlign: 'middle' } }>
          <div>
            { fixtureType.type === 'sensor' ? <i className='fas fa-rss'></i> : null }
            { fixtureType.type === 'actuator' ? <i className='fas fa-cogs'></i> : null }
            { fixtureType.type === 'regulator' ? <i className='fas fa-power-off'></i> : null }
            { fixtureType.type === 'camera' ? <i className='fas fa-camera'></i> : null }
          </div>
          <div style={ { color: 'gray' } }>{ fixtureType.type }</div>
        </td>
        <td>
          <div style={ { fontWeight: 'bold' } }>{ fixtureType.name }</div>
          <div style={ { color: 'gray' } }>{ fixtureType.id }</div>
        </td>
        <td>
          <ReactMarkdown source={ fixtureType.description } />
        </td>
        <td>
          {
            !inputs ? null : inputs.map((input) =>
              <div key={ input }>{ input }</div>,
            )
          }
          {
            !outputs ? null : outputs.map((output) =>
              <div key={ output }>{ output }</div>,
            )
          }
        </td>
      </tr>
    );
  }
}
