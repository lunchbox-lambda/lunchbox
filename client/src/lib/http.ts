import { injectable } from '../lib/inversify'
import { Observable } from 'rxjs'

export interface IHttp {
  get(url: string): Observable<any>
  post(url: string, body: any): Observable<any>
  put(url: string, body: any): Observable<any>
  delete(url: string): Observable<void>
}

@injectable()
export class Http implements IHttp {

  get(url: string): Observable<any> {
    return Observable.fromPromise(
      fetch(url, {
        method: 'GET'
      }).then(this.handleResponse)
    )
  }

  post(url: string, body: any): Observable<any> {
    return Observable.fromPromise(
      fetch(url, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(body)
      }).then(this.handleResponse)
    )
  }

  put(url: string, body: any): Observable<any> {
    return null
  }

  delete(url: string): Observable<void> {
    return null
  }

  private handleResponse(response: Response): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (response.status === 200) {
        resolve(response.json())
      }
      else if (response.status === 204) {
        resolve()
      }
      else {
        const message = await response.text()
        reject(new Error(message))
      }
    })
  }

}
