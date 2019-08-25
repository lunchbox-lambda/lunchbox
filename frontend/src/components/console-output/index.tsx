import './style.scss';
import app from 'lib/app';
import * as React from 'react';
import Component from 'components/common/component';
import { Button } from '@blueprintjs/core';
import Toaster from 'lib/toaster';

interface Props { }

interface State {
  data: string;
}

export default class ConsoleOutputComponent extends Component<Props, State> {
  private textArea: HTMLTextAreaElement

  public constructor(props: Props) {
    super(props);

    this.state = {
      data: '',
    };
  }

  public componentDidMount() {
    this.handleSubscriptions([

      app.services.diagnostics.getConsoleOutput()
        .subscribe((data) => this.setState({ data })),
    ]);
  }

  private onCopyClick(event) {
    this.textArea.select();
    document.execCommand('copy');
    event.target.focus();
    Toaster.success('Copied!');
  }

  public render() {
    return (
      <div className='content content-console-output'>
        <div className='flex-row' style={ { flex: '0 0 auto' } }>
          <h4>Console Output</h4>
          { this.renderActionBar() }
        </div >
        <div className='flex-row'>
          <textarea
            ref={ (textarea) => { this.textArea = textarea; } }
            value={ this.state.data }
            spellCheck={ false }
            readOnly={ true }
          ></textarea>
        </div>
      </div >
    );
  }

  private renderActionBar() {
    return (
      <div className='action-bar'>
        <Button className='pt-small' onClick={ this.onCopyClick.bind(this) }>
          Copy to clipboard
        </Button>
      </div>
    );
  }
}
