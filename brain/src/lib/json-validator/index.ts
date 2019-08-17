export interface JSONValidator {
  validate(data: any, schemaKey: string, batch?: boolean): Error;
  validateThrow(data: any, schemaKey: string, batch?: boolean): any;
}
