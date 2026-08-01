// This file contains code that we reuse
// between our tests.

import helper from 'fastify-cli/helper.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const AppPath = path.join(__dirname, '..', 'app.js')


const defaultEnv = {
  NODE_ENV: 'test',
  MONGO_URL: 'mongodb://localhost:27017/test',
  JWT_SECRET: 'secret-1234567890'
}
// Fill in this config with all the configurations
// needed for testing the application
function config (env) {
  return {
     configData: env// Register our application with fastify-plugin
  }
}

// automatically build and tear down our instance
async function build (t, env) {
  // you can set all the options supported by the fastify CLI command
  const argv = [AppPath] || '-l silent --options app.js'


  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  const app = await helper.build(argv, config({...defaultEnv, ...env}))

  // tear down our app after we are done
  t.after(() => app.close())

  return app
}

export {
  config,
  build
}
