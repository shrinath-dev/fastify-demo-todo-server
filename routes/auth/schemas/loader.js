import authRegisterBody from './register-schema.json' with {type: 'json'}
import authToken from './auth-token.json' with {type: 'json'}
import authTokenHeader from './auth-token-header.json' with {type: 'json'};
import user from './user.json' with {type: "json"};
import fastifyPlugin from 'fastify-plugin'


async function loader(fastify, options) {

  fastify.addSchema(authRegisterBody);
  fastify.addSchema(authToken);
  fastify.addSchema(authTokenHeader);
  fastify.addSchema(user);
}

export default fastifyPlugin(loader);
