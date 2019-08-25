import { TYPES, inject, injectable } from 'lib/inversify';
import { Repository } from 'lib/repository';
import { Component } from 'lib/component';

@injectable()
export default abstract class Service implements Component {
  @inject(TYPES.Repository) protected repository: Repository
  public async init() { }
}
