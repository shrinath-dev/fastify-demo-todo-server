import fastifyPlugin from "fastify-plugin";
import fastifyCors from "@fastify/cors";

async function corsPlugin(fastify, opts) {

  fastify.register(fastifyCors, {
    origin: true,
  })
}


export default fastifyPlugin(corsPlugin)
