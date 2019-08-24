import './style.scss';
import * as React from 'react';
import { Component } from 'components/common';

interface Props { }

interface State { }

export class DashboardComponent extends Component<Props, State> {
  public componentDidMount() {

  }

  public render() {
    return (
      <div className='content content-dashboard'>
        <div className='dashboard-container'>
          <iframe src='/red/dashboard'></iframe>
        </div>
      </div >
    );
  }
}
