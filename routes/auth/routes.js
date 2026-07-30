import fastifyPlugin from "fastify-plugin";
import generateHash from './generate-hash.js';

export const prefixOverride = '/';
async function authRoutes(fastify, options) {

  fastify.post('/register', {
    schema: {
      body: fastify.getSchema('schema:auth:register:body')
    },
    handler: async function registerHandler(request, reply) {

      // first check is it the existing user who is registering
      const user = await this.userDatasource.findUser(request.body.username);
      if (user) {
        const err = new Error('User already registered.')
        err.statusCode = 409
        throw err;
      }

      const { hash, salt } = await generateHash(request.body.password)
      try {
        const newUserId = await this.userDatasource.createUser({
          username: request.body.username,
          salt,
          hash
        })

        request.log.info({ userId: newUserId }, 'User resgistered.');
        reply.code(201);
        return({registered: true})
      } catch (err) {
        request.log.error(err, 'Failed to register user');
        reply.code(500);
        return { registered: false }
      }

    }
  })

  fastify.post('/authenticate', {
    schema: {
      body: fastify.getSchema('schema:auth:register:body'),
      reponse: {
        200: fastify.getSchema('schema:auth:token')
      }
    },
    handler: async function authenticateHandler(request, reply) {
      const user = await this.userDatasource.findUser(request.body.username);

      if (!user) {
        const err = new Error('Wrong Credentials')
        err.statusCode = 401
        throw err;
      }

      const { hash } = await generateHash(request.body.password, user.salt);
      if (hash !== user.hash) {
        const err = new Error('Wrong Credentials')
        err.statusCode = 401
        throw err;
      }

      request.user = user;
      return refreshHandler(request, reply);
    }
  })

  async function refreshHandler(request, reply) {
    const token = await request.generateToken();
    return {token}
  }

  fastify.get('/me', {
    onRequest: fastify.authenticate,
    schema: {
      headers: fastify.getSchema('schema:auth:token:header'),
      response: {
        200: fastify.getSchema('schema:user')
      }
    },
    handler: async function meHandler(request, reply) {
      return request.user
    }
  })

  fastify.post('/refresh', {
    onRequest: fastify.authenticate,
    schema: {
      header: fastify.getSchema('schema:auth:token:header'),
      response: {
        200: fastify.getSchema('schema:auth:token')
      }
    },
    handler: refreshHandler
  })

  fastify.post('/logout', {
    onRequest: fastify.authenticate,
    handler: async function logoutHandler(request, reply) {
      request.revokeToken()
      reply.code(204);
    }
  })
}


export default fastifyPlugin(authRoutes, { name: 'auth-routes', encapsulate: true, dependencies: ['authentication-plugin']})
