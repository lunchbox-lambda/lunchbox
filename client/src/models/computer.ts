import { Entity } from './entity'
import { Fixture } from './fixture'

export class Computer extends Entity {
  createdAt: Date
  updatedAt: Date
  name: string
  organization: string
  uuid: string
  version: string
  boardType: 'megaatmega2560' | 'uno'
  fixtures: Fixture[]

  localTime?: Date
  timeZone?: string
}
