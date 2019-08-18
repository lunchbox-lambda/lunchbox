import { Entity } from './entity';
import { Fixture } from './fixture';
import { ISerializable } from './serializable';

export class Computer extends Entity implements ISerializable {
  public createdAt: Date
  public updatedAt: Date
  public name: string
  public organization: string
  public uuid: string
  public version: string
  public boardType: 'megaatmega2560' | 'uno'
  public fixtures: Fixture[]

  public localTime?: Date
  public timeZone?: string

  public serialize?= () => ({
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
