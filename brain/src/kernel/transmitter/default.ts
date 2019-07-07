import logger from 'lib/logger'
import { TYPES, inject, injectable } from 'lib/inversify'
import { Transmitter } from 'kernel/transmitter'
import { Environment } from 'kernel/environment'
import { RecipeManager } from 'kernel/recipe-manager'
import { Broadcaster } from 'lib/broadcaster'
import { Scheduler } from 'lib/scheduler'

const log = logger('kernel:transmitter')

@injectable()
export class DefaultTransmitter implements Transmitter {

  @inject(TYPES.Scheduler) private scheduler: Scheduler
  @inject(TYPES.Broadcaster) private broadcaster: Broadcaster
  @inject(TYPES.Environment) private environment: Environment
  @inject(TYPES.RecipeManager) private recipeManager: RecipeManager

  async init() {
    log(`init`)

    await this.initBroadcasts()
  }

  private async initBroadcasts() {

    this.broadcaster.register('computer', () => Promise.resolve(
      this.environment.computer
    ))

    this.broadcaster.register('environment-list', () => {
      return Promise.resolve(this.environment.environments)
    })

    this.broadcaster.register('environment', () => {
      const { environments } = this.environment
      return environments.map(environment => Promise.resolve(
        this.environment.serializeForBroadcast(environment)
      ))
    })

    this.broadcaster.register('recipe-context', () => {
      const { recipeContexts } = this.recipeManager
      return Array.from(recipeContexts.keys()).map(key => Promise.resolve(
        recipeContexts.get(key).serializeForBroadcast()
      ))
    })

    this.scheduler.interval(() => {
      this.broadcaster.broadcast('environment')
    }, 5000)

    this.scheduler.interval(() => {
      // Broadcast recipe progress changes
      this.broadcaster.broadcast('recipe-context')
    }, 60000)

    this.scheduler.cron(() => {
      // Broadcast computer local time changes
      this.broadcaster.broadcast('computer')
    }, '0 * * * * *')

  }

}
