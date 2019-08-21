import * as path from 'path';
import config from 'config';

const settings = {

  interval: {
    persistenceFrequency: 5000,
    cameraPersistenceFrequency: 14500,
  },

};

try {
  const filePath = path.resolve(config.data.path, 'settings.json');
  const _settings = require(filePath);
  Object.assign(settings, _settings);
} catch { /* */ }

export default settings;
