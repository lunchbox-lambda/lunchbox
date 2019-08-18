import * as fs from 'fs';
import * as Ajv from 'ajv';
import * as path from 'path';
import logger from 'lib/logger';
import * as moment from 'moment';
import * as cronParser from 'cron-parser';
import { injectable } from 'lib/inversify';
import { JSONValidator } from 'lib/json-validator';

const log = logger('lib:json-validator');

@injectable()
export class DefaultJSONValidator implements JSONValidator {
  private ajv = new Ajv()

  public constructor() {
    const schemasPath = path.join(__dirname, '../../schemas');
    fs.readdirSync(schemasPath).forEach(file => {
      const schema = require(`schemas/${file}`);
      const key = path.parse(file).name;
      this.ajv.addSchema(schema, key);
    });

    this.ajv.addKeyword('_type', {
      type: 'string',
      errors: true,
      validate: function validate(schema, data) {
        try {
          if (schema === 'cron') {
            cronParser.parseExpression(data);
          }

          else if (schema === 'duration') {
            const duration = moment.duration(data);
            if (duration.toISOString() === 'P0D')
              throw new Error(`Invalid ISO 8601 duration pattern ${data}`);
          }

          return true;
        }
        catch (error) {
          validate['errors'] = [{ message: error.message }];
          return false;
        }
      }
    });
  }

  public validate(data: any, schemaKey: string, batch?: boolean): Error {
    let isValid = true;

    if (batch) {
      data.forEach(item => {
        isValid = isValid && this.ajv.validate(schemaKey, item) as boolean;
        return isValid;
      });
    }
    else isValid = isValid && this.ajv.validate(schemaKey, data) as boolean;

    const message = isValid ? null : this.ajv.errorsText();
    if (!isValid) log(`${schemaKey}: ${message}`, 'error');

    return isValid ? null : new Error(message);
  }

  public validateThrow(data: any, schemaKey: string, batch?: boolean): any {
    const validateError = this.validate(data, schemaKey, batch);
    if (validateError) throw validateError;
    else return data;
  }
}
