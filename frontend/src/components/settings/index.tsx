import app from 'lib/app';
import * as React from 'react';
import { Component } from 'components/common';
import { Button } from '@blueprintjs/core';
import { Toaster } from 'lib/toaster';

interface Props { }

interface State {
  isEditing: boolean;
  settings: object;
}

export class SettingsComponent extends Component<Props, State> {
  private textArea: HTMLTextAreaElement

  public constructor(props: Props) {
    super(props);

    this.state = {
      isEditing: false,
      settings: null,
    };
  }

  public componentDidMount() {
    this.handleSubscriptions([

      app.services.computer.getSettings()
        .subscribe((settings) =>
          this.setState({ settings }),
        ),
    ]);
  }

  private onEditClick() {
    this.setState({ isEditing: true });
  }

  private onCancelClick() {
    this.setState({ isEditing: false });
  }

  private onSaveClick() {
    try {
      const settings = JSON.parse(this.textArea.value);

      this.handleSubscriptions([
        app.services.computer.setSettings(settings)
          .subscribe(() => {
            this.setState({ isEditing: false, settings });
            Toaster.success('Settings saved successfuly.');
          }, Toaster.error),
      ]);
    } catch (error) { Toaster.error(error); }
  }

  public render() {
    return (
      <div className='content'>
        <div className='flex-row' style={ { flex: '0 0 auto' } }>
          <h4>Settings</h4>
          { this.renderActionBar() }
        </div>
        {
          !this.state.settings ? null :
            !this.state.isEditing ? this.renderSettingsView() : this.renderTextArea()
        }
      </div>
    );
  }

  private renderActionBar() {
    return (
      <div className='action-bar'>
        {
          !this.state.isEditing ?
            <div>
              <Button className='pt-small' onClick={ this.onEditClick.bind(this) }>Edit</Button>
            </div>
            :
            <div>
              <Button className='pt-small' onClick={ this.onCancelClick.bind(this) }>Cancel</Button>
              <Button className='pt-small pt-intent-primary' onClick={ this.onSaveClick.bind(this) }>Save</Button>
            </div>
        }
      </div>
    );
  }

  private renderSettingsView() {
    return (
      <div>
        <pre>{ JSON.stringify(this.state.settings, null, '    ') }</pre>
      </div>
    );
  }

  private renderTextArea() {
    return (
      <textarea
        ref={ (textarea) => { this.textArea = textarea; } }
        className='pt-input pt-fill'
        defaultValue={ JSON.stringify(this.state.settings, null, '    ') }
        rows={ 10 }
        spellCheck={ false }>
      </textarea>
    );
  }
}
