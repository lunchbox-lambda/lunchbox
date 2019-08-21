import * as path from 'path';

const dataPath = '/data';

export default {

  projectDir: path.resolve(__dirname, '..'),

  data: {
    path: dataPath,
  },

  board: {
    port: '/dev/controller',
  },

  server: {
    port: 80,
    public: path.resolve(__dirname, '../../../frontend/dist'),
  },

  platformio: {
    path: '/platformio',
  },

  leveldb: {
    path: path.resolve(dataPath, 'db'),
  },

  nodered: {
    httpAdminRoot: '/red',
    httpNodeRoot: '/red/dashboard',
    ui: { path: '' },
    userDir: path.resolve(__dirname, '../../../node-red'),
    flowFile: 'flows.json',
    functionGlobalContext: {
      serverHost: 'http://localhost:80',
    },
  },

  ssl: {
    certFile: 'lunchbox-node.crt',
    keyFile: 'lunchbox-node.key',
  },

  git: {
    baseUrl: 'https://github.com/lunchbox-lambda',
  },

};
