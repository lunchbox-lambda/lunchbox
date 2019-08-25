import Entity from './entity';
import Fixture from './fixture';

export default class Computer extends Entity {
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
}
