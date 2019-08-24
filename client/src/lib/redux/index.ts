import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { createStore, Action } from 'redux';
import { injectable } from '../../lib/inversify';
import { IStore, IStoreState } from './store';
import reducers from './reducers';

const store = createStore<IStoreState, any, any, any>(reducers);
const subject = new Subject<IStoreState>();
const observable = subject.asObservable();

store.subscribe(() => {
  const state = store.getState();
  subject.next(state);
});

@injectable()
export class ReduxStore implements IStore {
  public dispatch(action: Action) {
    store.dispatch(action);
  }

  private getObservable() {
    const state = store.getState();
    return observable.startWith(state);
  }

  private getStoreItem(item: any) {
    return this.getObservable()
      .map((store) => store[item])
      .filter((value) => value !== null)
      .distinctUntilChanged(_.isEqual);
  }

  public getConnectivity() {
    return this.getStoreItem('connectivity');
  }

  public getComputer() {
    return this.getStoreItem('computer');
  }

  public getEnvironmentList() {
    return this.getStoreItem('environmentList');
  }

  public getEnvironments() {
    return this.getStoreItem('environments');
  }

  public getRecipeContexts() {
    return this.getStoreItem('recipeContexts');
  }
}

export * from './actions';
export * from './store';
