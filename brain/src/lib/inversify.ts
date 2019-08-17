export const TYPES = {

  Broadcaster: Symbol('Broadcaster'),
  ComputerInit: Symbol('ComputerInit'),
  DataSync: Symbol('DataSync'),
  JSONValidator: Symbol('JSONValidator'),
  NodeRed: Symbol('NodeRed'),
  Repository: Symbol('Repository'),
  ServiceHolder: Symbol('ServiceHolder'),
  Scheduler: Symbol('Scheduler'),
  Socket: Symbol('Socket'),

  Firmware: Symbol('Firmware'),

  CommandCenter: Symbol('CommandCenter'),
  Controllers: Symbol('Controllers'),
  Environment: Symbol('Environment'),
  Peripherals: Symbol('Peripherals'),
  Persistence: Symbol('Persistence'),
  RecipeManager: Symbol('RecipeManager'),
  Transmitter: Symbol('Transmitter'),

  CameraService: Symbol('CameraService'),
  ComputerService: Symbol('ComputerService'),
  DiagnosticsService: Symbol('DiagnosticsService'),
  EnvironmentService: Symbol('EnvironmentService'),
  FixtureTypeService: Symbol('FixtureTypeService'),
  RecipeService: Symbol('RecipeService'),
  VariableService: Symbol('VariableService'),

  WebApi: Symbol('WebApi'),
  Router: Symbol('Router')
};

export { inject, injectable } from 'inversify';
