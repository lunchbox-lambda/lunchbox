import logger from 'lib/logger'
import * as cronParser from 'cron-parser'
import { Subject, Observable } from 'rxjs'
import { Scheduler } from 'lib/scheduler'
import { injectable } from 'inversify'

const log = logger('lib:scheduler')

const INTERVAL = 1000

@injectable()
export class DefaultScheduler implements Scheduler {

  private subject = new Subject()
  private expected: number

  async start() {
    this.expected = Date.now() + INTERVAL
    this.schedule()
    log(`started`)
  }

  timeout(next: () => void, timeout: number) {
    return this.subject
      .bufferCount(Math.ceil(timeout / INTERVAL))
      .map(value => undefined)
      .first()
      .subscribe(next)
  }

  interval(next: () => void, timeout: number) {
    return this.subject
      .bufferCount(Math.ceil(timeout / INTERVAL))
      .map(value => undefined)
      .subscribe(next)
  }

  cron(next: () => void, pattern: string) {
    return this.subject
      .pipe(cronOperator(pattern))
      .map(value => undefined)
      .subscribe(next)
  }

  private step() {
    const diff = Date.now() - this.expected
    this.expected += INTERVAL
    this.schedule(INTERVAL - diff)
    this.subject.next(Date.now())
  }

  private schedule(timeout: number = INTERVAL) {
    setTimeout(() => this.step(),
      Math.max(0, timeout)
    )
  }

}

const cronOperator = (pattern) => {
  return (source) => {
    return Observable.create(subscriber => {

      const interval = cronParser.parseExpression(pattern)
      let nextTime = interval.next().toDate().getTime()

      return source.subscribe(
        value => {
          if (nextTime <= value) {
            nextTime = interval.next().toDate().getTime()
            try {
              subscriber.next()
            } catch (error) {
              subscriber.error(error)
            }
          }
        },
        error => subscriber.error(error),
        () => subscriber.complete())
    })
  }
}
