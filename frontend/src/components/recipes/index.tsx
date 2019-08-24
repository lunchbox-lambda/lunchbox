import app from 'lib/app';
import * as React from 'react';
import { Component } from 'components/common';
import { Recipe } from '@lunchbox-lambda/client';

interface Props { }

interface State {
  recipes: Recipe[];
}

export class RecipeBookComponent extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      recipes: [],
    };
  }

  public componentDidMount() {
    this.handleSubscriptions([

      app.services.recipes.query()
        .subscribe((recipes) => {
          recipes.sort((a, b) => a.name.localeCompare(b.name));
          this.setState({ recipes });
        }),
    ]);
  }

  public render() {
    return (
      <div className='content'>
        <h4>Recipe Book</h4>
        <table className="pt-table pt-condensed pt-striped">
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            { this.state.recipes.map((recipe) =>
              <tr key={ recipe.id }>
                <td>
                  <div style={ { fontWeight: 'bold' } }>{ recipe.name }</div>
                </td>
              </tr>,
            ) }
          </tbody>
        </table>
      </div>
    );
  }
}
