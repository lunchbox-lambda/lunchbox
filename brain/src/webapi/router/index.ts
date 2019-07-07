import { Express } from 'express'

export interface Router {
  config(app: Express): Promise<void>
}
