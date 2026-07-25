import fastifyPlugin from "fastify-plugin";

async function errorHandler(fastify, opts) {

  fastify.setErrorHandler((err, req, reply) => {

    if (reply.statusCode >= 500) {

      req.log.error({ req, res: reply, err: err }, err?.message);
      reply.send(`fatal error please contact support team, ID: ${req.id}`)

      return;
    }

    req.log.info({ req, res: reply, err: err }, err?.message);
    reply.send(err);
    return;
  })
}

export default fastifyPlugin(errorHandler);
