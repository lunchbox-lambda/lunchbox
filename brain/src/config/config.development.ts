import * as path from 'path';

const dataPath = `/data/${process.env.LBOX_COMPUTER_NAME}`;

export default {

  projectDir: path.resolve(__dirname, '..'),

  data: {
    path: dataPath
  },

  board: {
    port: '/dev/ttyACM0'
  },

  server: {
    port: 8090,
    public: path.resolve(__dirname, '../../../frontend/dist'),
  },

  platformio: {
    path: path.resolve(__dirname, '../../platformio')
  },

  leveldb: {
    path: path.resolve(dataPath, 'db')
  },

  nodered: {
    httpAdminRoot: '/red',
    httpNodeRoot: '/red/dashboard',
    ui: { path: '' },
    userDir: path.resolve(__dirname, '../../../node-red'),
    flowFile: 'flows.json',
    functionGlobalContext: {
      serverHost: 'http://localhost:8090'
    }
  },

  ssl: {
    certFile: 'lunchbox-node.crt',
    keyFile: 'lunchbox-node.key'
  },

  git: {
    baseUrl: 'https://github.com/lunchbox-lambda'
  }

};
