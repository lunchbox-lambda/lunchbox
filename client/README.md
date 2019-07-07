# Lunchbox λ \ client

Shared module to define client side models, store application state and communicate with the [brain](https://github.com/lunchbox-lambda/brain).


### Initialization
```
const config = {
  serverHost: 'http://localhost:80'
}

const app = client(config);
```

### Interface
```
store,
services: {
  variables,
  fixtureTypes,
  recipes,
  computer,
  diagnostics,
  environment
}
```
