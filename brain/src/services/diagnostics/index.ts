import { Component } from 'lib/component';
import Diagnostics from 'models/diagnostics';
import { Connectivity } from 'models/connectivity';

export interface DiagnosticsService extends Component {
  getDiagnostics(): Promise<Diagnostics>;
  getConnectivity(): Promise<Connectivity>;
  getConsoleOutput(): Promise<string>;
}
