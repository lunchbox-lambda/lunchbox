import { Component } from 'lib/component';
import { Board } from 'johnny-five';

export interface Firmware extends Component {
  board: Board;
  status: boolean;
}
