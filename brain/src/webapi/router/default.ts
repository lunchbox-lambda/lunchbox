import config from 'config'
import * as fs from 'fs'
import * as path from 'path'
import * as express from 'express'
import { Express } from 'express'
import { Router } from 'webapi/router'
import { RouteDeps } from 'webapi/rest-api/route'
import { ServiceHolder } from 'lib/service-holder'
import { JSONValidator } from 'lib/json-validator'
import { TYPES, inject, injectable } from 'lib/inversify'
import { apiVersioning } from 'webapi/middleware/api-versioning'

@injectable()
export class DefaultRouter implements Router {

  @inject(TYPES.ServiceHolder) private services: ServiceHolder
  @inject(TYPES.JSONValidator) private validator: JSONValidator

  async config(app: Express) {

    // Static Router
    app.use(express.static(config.server.public))

    // Public API Router
    app.use('/api/v:version', apiVersioning(), await this.mountRESTApi())

    // Browser Router
    app.use('/*', (req, res) => {
      res.sendFile(path.resolve(config.server.public, 'index.html'))
    })

  }

  private async mountRESTApi(): Promise<express.Router> {
    const router = express.Router()
    const { services, validator } = this

    const root = path.resolve(__dirname, '../rest-api')
    for (let entry of fs.readdirSync(root)) {
      const dir = path.join(root, entry)
      if (!fs.statSync(dir).isDirectory()) continue
      const route = await import(dir) as (deps: RouteDeps) => void
      route({ router, services, validator })
    }

    return router
  }

}
