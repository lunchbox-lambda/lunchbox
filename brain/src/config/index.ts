import configDevelopment from './config.development';
import configProduction from './config.production';

interface IConfig {

  projectDir: string;

  data: {
    path: string;
  };

  board: {
    port: string;
  };

  server: {
    port: number;
    public: string;
  };

  platformio: {
    path: string;
  };

  leveldb: {
    path: string;
  };

  nodered: any;

  ssl: {
    certFile: string;
    keyFile: string;
  };

  git: {
    baseUrl: string;
  };
}

let _config: IConfig;
const config = {} as IConfig;

if (process.env.NODE_ENV === 'production')
  _config = configProduction;

if (process.env.NODE_ENV === 'development')
  _config = configDevelopment;

Object.assign(config, _config);

export default config;
