import client from '@lunchbox-lambda/client'

const config = {
  serverHost: location.origin
}

const app = client(config)

export default app
