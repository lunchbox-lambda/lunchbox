import { Entity } from './entity';

export default class FixtureType extends Entity {
  public name: string
  public type: 'sensor' | 'actuator' | 'regulator' | 'camera'
  public description?: string
  public inputs?: string[]
  public outputs?: string[]
  public params?: null
}
