import { Component } from 'lib/component';
import { Connectivity, Diagnostics } from 'models';

export interface DiagnosticsService extends Component {
  getDiagnostics(): Promise<Diagnostics>;
  getConnectivity(): Promise<Connectivity>;
  getConsoleOutput(): Promise<string>;
}
