import app from 'lib/app';
import * as React from 'react';
import Component from 'components/common/component';
import { Observable } from 'rxjs';
import { Button, Switch } from '@blueprintjs/core';
import { Controller } from '@lunchbox-lambda/client';
import { resolveEnvironment } from 'lib/tools';

interface Props { }

interface State {
  environments: string[];
  controllers: Controller[];
  sensorData: any[];
  cameraData: any[];
}

export default class DiagnosticsComponent extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      environments: [],
      controllers: [],
      sensorData: [],
      cameraData: [],
    };
  }

  public componentDidMount() {
    this.handleSubscriptions([

      Observable
        .combineLatest(
          app.store.getEnvironmentList(),
          app.store.getEnvironments(),
          app.services.diagnostics.getDiagnostics(),
        )
        .filter(([environmentList, environments]) => {
          return environmentList.every((environment) =>
            !!environments[environment],
          );
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .subscribe(([environmentList, environments, diagnostics]) => {
          const data = { environments, ...diagnostics };
          this.processData(data);
        }),

      app.store.getEnvironmentList()
        .subscribe((environments) => this.setState({ environments })),

    ]);
  }

  private keyById = (items) => (!items ? {} :
    items.reduce((acc, value) => {
      acc[value.id] = value;
      return acc;
    }, {}))

  private sortByVariable = (items: any[], k = 'variable') => (!items ? [] :
    items.sort((a, b) =>
      ((!a[k] || !b[k]) ? 0 : a[k].localeCompare(b[k])),
    ))

  private processData(data): void {
    const { environments, peripherals } = data;

    const _sensors = this.keyById(peripherals.sensors);
    const _actuators = this.keyById(peripherals.actuators);
    const _regulators = this.keyById(peripherals.regulators);
    // const _cameras = this.keyById(peripherals.cameras)

    const controllers = this.sortByVariable(
      data.controllers.map((controller) => {
        const { id, type, state, active, variable } = controller;
        const { sensors = [], actuators = [], regulators = [] } = controller;
        const env = variable ? resolveEnvironment(variable) : null;
        const sensorReadings = env ? environments[env].sensorReadings : {};
        const desiredValues = env ? environments[env].desiredValues : {};

        return {
          id, type, state, active, variable,
          sensors: sensors.map((id) => _sensors[id]),
          actuators: actuators.map((id) => _actuators[id]),
          regulators: regulators.map((id) => _regulators[id]),
          currentValue: sensorReadings[variable],
          desiredValue: desiredValues[variable],
        };
      }),
    );

    const sensorData = this.sortByVariable(
      peripherals.sensors.reduce((result, sensor) => {
        Object.keys(sensor.data).forEach((key) => {
          const { id, pin, env } = sensor;
          result.push({
            id, pin, env,
            variable: key,
            value: sensor.data[key],
          });
        });
        return result;
      }, []),
    );

    const cameraData = this.sortByVariable(
      peripherals.cameras.map((camera) => {
        const { id, dev, env } = camera;
        return {
          id, dev, env,
          variable: camera.variable,
          pictureSize: camera.size,
        };
      }),
    );

    this.setState({ controllers, sensorData, cameraData });
  }

  private onToggleController(controller: Controller) {
    const command = controller.active ? 'turn-off' : 'turn-on';
    app.services.computer.commandController(command, controller.id);
  }

  private onResetClick(controller: Controller) {
    const command = 'reset';
    app.services.computer.commandController(command, controller.id);
  }

  private renderControllerRow(controller: Controller) {
    if (controller.type === 'pid') return this.renderPIDControllerRow(controller);

    if (controller.type === 'regulator') return this.renderRegulatorControllerRow(controller);

    return null;
  }

  private renderPIDControllerRow(controller: Controller) {
    return (
      <tr key={ controller.id }>
        <td>
          <div style={ { fontWeight: 'bold', color: controller.state === 0 ? 'inherit' : 'red' } }>
            { controller.variable }
          </div>
          <div style={ { margin: '5px 10px 0px 10px' } }>
            {
              controller.sensors.map((sensor) =>
                <div key={ sensor.id } className="flex-row" style={ { alignItems: 'center' } }>
                  <i className="fas fa-fw fa-rss"></i>
                  <div style={ { flexGrow: 0, margin: '0 10px' } }>{ sensor.pin }</div>
                  <div style={ { flexGrow: 0 } }>{ sensor.env }</div>
                  <div style={ { flexGrow: 0, margin: '0 10px' } }>{ sensor.id }</div>
                </div>,
              )
            }
            {
              controller.actuators.map((actuator) =>
                <div key={ actuator.id } className="flex-row" style={ { alignItems: 'center' } }>
                  <i className="fas fa-fw fa-cogs"></i>
                  <div style={ { flexGrow: 0, margin: '0 10px' } }>{ actuator.pin }</div>
                  <div style={ { flexGrow: 0 } }>{ actuator.env }</div>
                  <div style={ { flexGrow: 0, margin: '0 10px' } }>{ actuator.id }</div>
                </div>,
              )
            }
          </div>
        </td>
        <td style={ { textAlign: 'center', verticalAlign: 'middle' } }>
          {
            controller.state === 0 ? null :
              <Button
                className='pt-small pt-intent-danger'
                onClick={ this.onResetClick.bind(this, controller) }>Reset
              </Button>
          }
        </td>
        <td style={ { textAlign: 'center', verticalAlign: 'middle' } }>
          <div style={ { fontWeight: 'bold', fontSize: '1.5em' } } >
            {
              controller.currentValue === undefined ?
                <span>&mdash;</span> : <span>{ controller.currentValue }</span>
            }
          </div>
        </td>
        <td style={ { textAlign: 'center', verticalAlign: 'middle' } }>
          <div style={ { fontSize: '1.5em' } }>
            {
              controller.desiredValue === undefined ?
                <span>&mdash;</span> : <span>{ controller.desiredValue }</span>
            }
          </div>
        </td>
        <td style={ { textAlign: 'center', verticalAlign: 'middle' } }>
          { this.renderControllerStateCell(controller) }
        </td>
      </tr>
    );
  }

  private renderRegulatorControllerRow(controller: Controller) {
    const [regulator] = controller.regulators;
    return (
      <tr key={ controller.id }>
        <td>
          <div style={ { fontWeight: 'bold', color: controller.state === 0 ? 'inherit' : 'red' } }>
            { `${regulator.env}::${regulator.id}` }
          </div>
          <div style={ { margin: '5px 10px 0px 10px' } }>
            {
              controller.regulators.map((regulator) =>
                <div key={ regulator.id } className="flex-row" style={ { alignItems: 'center' } }>
                  <i className="fas fa-fw fa-power-off"></i>
                  <div style={ { flexGrow: 0, margin: '0 10px' } }>{ regulator.pin }</div>
                  <div style={ { flexGrow: 0 } }>{ regulator.env }</div>
                  <div style={ { flexGrow: 0, margin: '0 10px' } }>{ regulator.id }</div>
                </div>,
              )
            }
          </div>
        </td>
        <td style={ { textAlign: 'center', verticalAlign: 'middle' } }>
          {
            controller.state === 0 ? null :
              <Button
                className='pt-small pt-intent-danger'
                onClick={ this.onResetClick.bind(this, controller) }>Reset
              </Button>
          }
        </td>
        <td></td>
        <td></td>
        <td style={ { textAlign: 'center', verticalAlign: 'middle' } }>
          { this.renderControllerStateCell(controller) }
        </td>
      </tr>
    );
  }

  private renderControllerStateCell(controller: Controller) {
    return (
      <Switch
        style={ { margin: 0, paddingLeft: 30 } }
        inline={ true }
        className='pt-large'
        checked={ controller.active }
        onChange={ () => this.onToggleController(controller) } />

    );
  }

  private renderSensorDataRow(data: any) {
    return (
      <tr key={ `${data.id}${data.variable}` }>
        <td>
          <div style={ { fontWeight: 'bold' } }>{ data.variable }</div>
          <div className="flex-row">
            <div style={ { flexGrow: 0 } }>{ data.pin }</div>
            <div style={ { flexGrow: 0, margin: '0 10px' } }>{ data.env }</div>
            <div style={ { flexGrow: 0 } }>{ data.id } </div>
          </div>
        </td>
        <td style={ { textAlign: 'center', verticalAlign: 'middle' } }>
          <div>{ data.value }</div>
        </td>
      </tr>
    );
  }

  private renderCameraDataRow(data: any) {
    return (
      <tr key={ `${data.id}${data.variable}` }>
        <td>
          <div style={ { fontWeight: 'bold' } }>{ data.variable }</div>
          <div className="flex-row">
            <div style={ { flexGrow: 0 } }>{ data.dev }</div>
            <div style={ { flexGrow: 0, margin: '0 10px' } }>{ data.env }</div>
            <div style={ { flexGrow: 0 } }>{ data.id } </div>
          </div>
        </td>
        <td style={ { textAlign: 'center', verticalAlign: 'middle' } }>
          <div>{ data.pictureSize }</div>
        </td>
      </tr>
    );
  }

  public render() {
    return (
      <div className='content'>
        <h4>Diagnostics</h4>
        <div className='flex-row'>
          <div>
            <table className="pt-table pt-condensed pt-striped">
              <thead>
                <tr>
                  <th>Controllers</th>
                  <th style={ { width: '75px', textAlign: 'center' } }></th>
                  <th style={ { width: '100px', textAlign: 'center' } }>Value</th>
                  <th style={ { width: '100px', textAlign: 'center' } }>Target</th>
                  <th style={ { width: '100px', textAlign: 'center' } }>State</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.controllers.map((controller) =>
                    this.renderControllerRow(controller),
                  )
                }
              </tbody>
            </table>
          </div>
          <div style={ { flexBasis: '25px', flexGrow: 0 } } />
          <div>
            <table className="pt-table pt-condensed pt-striped">
              <thead>
                <tr>
                  <th>Sensor Data</th>
                  <th style={ { width: '100px', textAlign: 'center' } }>Value</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.sensorData.map((data) =>
                    this.renderSensorDataRow(data),
                  )
                }
              </tbody>
            </table>
            <div style={ { height: '50px' } } />
            <table className="pt-table pt-condensed pt-striped">
              <thead>
                <tr>
                  <th>Camera Data</th>
                  <th style={ { width: '100px', textAlign: 'center' } }>Picture Size</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.cameraData.map((data) =>
                    this.renderCameraDataRow(data),
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
