import fastifyPlugin from "fastify-plugin";
import fastifySwagger from "@fastify/swagger";
import packageInfo from '../package.json' with {type: 'json'};



async function apiDocs(fastify, opts) {

  fastify.register(fastifySwagger, {
    routePrefix: '/docs',
    exposeRoute: fastify.secrets.NODE_ENV !== 'production',
    swagger: {
      info: {
        title: 'Fastify App',
        description: 'Fastify Book Examples',
        version: packageInfo.version
      }
    }
  })
}

export default fastifyPlugin(apiDocs);
