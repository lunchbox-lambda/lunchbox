import { Component } from 'lib/component'

export interface CameraService extends Component {
  getCameraPicture(variableName: string): Promise<Buffer>
}
