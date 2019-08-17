import { Entity } from './entity';

export class Fixture extends Entity {
  type: string
  pin?: number | string
  dev?: string
  env: string
  disabled?: boolean
  params?: {
    cron?: string;
    duration?: string;
    always?: 'on' | 'off';
  }
}
