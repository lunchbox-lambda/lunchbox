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

let config: IConfig;

if (process.env.NODE_ENV === 'production') {
  config = configProduction;
}

if (process.env.NODE_ENV === 'development') {
  config = configDevelopment;
}

export default { ...config };
