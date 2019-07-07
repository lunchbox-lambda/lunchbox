import { Entity } from './entity'
import { Fixture } from './fixture'
import { ISerializable } from './serializable'

export class Computer extends Entity implements ISerializable {
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

  serialize?= () => ({
    id: this.id,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    name: this.name,
    organization: this.organization,
    uuid: this.uuid,
    version: this.version,
    boardType: this.boardType,
    fixtures: this.fixtures
  })

}
