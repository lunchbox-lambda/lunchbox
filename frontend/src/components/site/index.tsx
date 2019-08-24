import './style.scss';
import * as React from 'react';
import { Component } from 'components/common';
import { Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Navbar } from 'components/site/navbar';
import { Siderbar } from 'components/site/sidebar';
import { ConnectivitySpinnerComponent } from 'components/common';
import { DashboardComponent } from 'components/dashboard';
import { DiagnosticsComponent } from 'components/diagnostics';
import { FixtureTypeListComponent } from 'components/fixture-types';
import { VariableListComponent } from 'components/variables';
import { RecipeBookComponent } from 'components/recipes';
import { ArchitectureComponent } from 'components/architecture';
import { ControlRoomComponent } from 'components/control-room';
import { ConsoleOutputComponent } from 'components/console-output';
import { SettingsComponent } from 'components/settings';

interface Props { }

interface State { }

export class Site extends Component<Props, State> {
  public componentDidMount() {

  }

  public render() {
    return (
      <div>
        <Navbar />
        <section className="container">
          <ConnectivitySpinnerComponent />
          <Siderbar />
          <div className="divider" />
          <div className="content-wrap">
            <Route exact path="/" render={ () => <Redirect to="/diagnostics" /> } />
            <Route exact path="/dashboard" component={ DashboardComponent } />
            <Route exact path="/diagnostics" component={ DiagnosticsComponent } />
            <Route exact path="/fixture-types" component={ FixtureTypeListComponent } />
            <Route exact path="/variables" component={ VariableListComponent } />
            <Route exact path="/recipe-book" component={ RecipeBookComponent } />
            <Route exact path="/architecture" component={ ArchitectureComponent } />
            <Route exact path="/control-room" component={ ControlRoomComponent } />
            <Route exact path="/console-output" component={ ConsoleOutputComponent } />
            <Route exact path="/settings" component={ SettingsComponent } />
          </div>
        </section>
      </div>
    );
  }
}
