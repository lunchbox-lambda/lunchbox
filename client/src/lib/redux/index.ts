import * as _ from 'lodash'
import { injectable } from '../../lib/inversify'
import { Subject, Observable } from 'rxjs'
import { createStore, Action } from 'redux'
import { IStore, IStoreState } from './store'
import reducers from './reducers'

const store = createStore<IStoreState>(reducers)
const subject = new Subject<IStoreState>()
const observable = subject.asObservable()

store.subscribe(() => {
  const state = store.getState()
  subject.next(state)
})

@injectable()
export class ReduxStore implements IStore {

  dispatch(action: Action) {
    store.dispatch(action)
  }

  private getObservable() {
    const state = store.getState()
    return observable.startWith(state)
  }

  private getStoreItem(item: any) {
    return this.getObservable()
      .map(store => store[item])
      .filter(value => value !== null)
      .distinctUntilChanged(_.isEqual)
  }

  getConnectivity() {
    return this.getStoreItem('connectivity')
  }

  getComputer() {
    return this.getStoreItem('computer')
  }

  getEnvironmentList() {
    return this.getStoreItem('environmentList')
  }

  getEnvironments() {
    return this.getStoreItem('environments')
  }

  getRecipeContexts() {
    return this.getStoreItem('recipeContexts')
  }

}

export * from './actions'
export * from './store'
