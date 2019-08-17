import { Entity } from './entity';

export class FixtureType extends Entity {
  name: string
  type: 'sensor' | 'actuator' | 'regulator' | 'camera'
  description?: string
  inputs?: string[]
  outputs?: string[]
  params?: null
}
