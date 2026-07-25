import dotenv from './env/env-schema.json' with {type: 'json'}
import fastifyPlugin from 'fastify-plugin'

async function loader(fastify, opts) {
  fastify.addSchema(dotenv)
}

export default fastifyPlugin(loader);
