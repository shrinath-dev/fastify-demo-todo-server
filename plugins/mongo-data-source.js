import fastifyPlugin from "fastify-plugin";
import { fastifyMongodb } from "@fastify/mongodb";



async function mongodbPlugin(fastify, opts) {

  fastify.register(fastifyMongodb, opts.mongo)
};


export default fastifyPlugin(mongodbPlugin)
