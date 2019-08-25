import { Entity } from './entity';

export default class Fixture extends Entity {
  public type: string
  public pin?: number | string
  public dev?: string
  public env: string
  public disabled?: boolean
  public params?: {
    cron?: string;
    duration?: string;
    always?: 'on' | 'off';
  }
}
