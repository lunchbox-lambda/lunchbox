import client from '@lunchbox-lambda/client';

const config = {
  serverHost: window.location.origin,
};

const app = client(config);

export default app;
