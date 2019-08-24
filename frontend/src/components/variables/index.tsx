import app from 'lib/app';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { Component } from 'components/common';
import { Variable } from '@lunchbox-lambda/client';

interface Props { }

interface State {
  variables: Variable[];
}

export class VariableListComponent extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      variables: [],
    };
  }

  public componentDidMount() {
    this.handleSubscriptions([

      app.services.variables.query()
        .subscribe((variables) => {
          variables.sort((a, b) => a.name.localeCompare(b.name));
          this.setState({ variables });
        }),
    ]);
  }

  public render() {
    return (
      <div className='content'>
        <h4>Variables</h4>
        <table className="pt-table pt-condensed pt-striped">
          <thead>
            <tr>
              <th style={ { width: '75px' } }>Unit</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            { this.state.variables.map((variable) =>
              <tr key={ variable.id }>
                <td style={ { textAlign: 'center', verticalAlign: 'middle' } }>
                  <div style={ { fontSize: '1.25em' } }>{ variable.unit }</div>
                </td>
                <td>
                  <div style={ { fontWeight: 'bold' } }>{ variable.name }</div>
                  <div style={ { color: 'gray' } }>{ variable.id }</div>
                </td>
                <td>
                  <ReactMarkdown source={ variable.description } />
                </td>
              </tr>,
            ) }
          </tbody>
        </table>
      </div>
    );
  }
}
