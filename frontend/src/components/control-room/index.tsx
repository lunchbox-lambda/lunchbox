import './style.scss';
import app from 'lib/app';
import * as React from 'react';
import Component from 'components/common/component';
import { Button } from '@blueprintjs/core';
import RecipeControlsComponent from 'components/recipe-controls';

interface Props { }

interface State { }

export default class ControlRoomComponent extends Component<Props, State> {
  public componentDidMount() { }

  private onRestartClick() {
    if (!window.confirm('Are you sure?')) return;
    app.services.computer.restartComputer();
  }

  private onNodeREDClick() {
    window.open('/red', '_blank');
  }

  private renderComputerPanel() {
    return (
      <div className='pt-card control-panel computer-panel'>
        <div className="computer-buttons">
          <Button onClick={ this.onRestartClick.bind(this) }>Restart Computer</Button>
          <Button onClick={ this.onNodeREDClick.bind(this) }>Launch NodeRED</Button>
        </div>
      </div>
    );
  }

  public render() {
    return (
      <div className='content content-control-room'>
        <h4>Control Room</h4>
        <div>
          <div className="controls">
            { this.renderComputerPanel() }
            <RecipeControlsComponent />
            <div className='control-panel'></div>
            <div className='control-panel'></div>
          </div>
        </div>
      </div>
    );
  }
}
