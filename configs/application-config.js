import fastifyPlugin from "fastify-plugin";
import fastifyEnv from "@fastify/env";

async function configLoader(fastify, opts) {

  await fastify.register(fastifyEnv, {
    confKey: 'secrets',
    schema: fastify.getSchema('schema:dotenv'),
  })

  fastify.decorate('config', {
    mongo: {
      forceClose: true,
      url: fastify.secrets.MONGO_URL
    },
  })
}

export default fastifyPlugin(configLoader)
