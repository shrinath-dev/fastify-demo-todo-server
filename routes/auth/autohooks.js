import fastifyPlugin from "fastify-plugin";
import schemas from './schemas/loader.js';

async function authAutoHooks(fastify, options) {

  // fetch the users collection from our connect monogo db instance
  const users = fastify.mongo.db.collection('users');

  // load all schemas specifically declared for auth routes
  fastify.register(schemas);

  // here we decorate the fastify intance with a object which provide us the neccessary function to work with authenticating users


  fastify.decorate('userDatasource', {
    async createUser(user) {
      const newUser = await users.insertOne(user)
      return newUser.insertedId;
    },

    async findUser(username) {
      const user = await users.findOne({ username });
      return user;
    }
  })
}

export default fastifyPlugin(authAutoHooks, { name: 'auth-auto-hooks', encapsulate: true, dependencies: ['mongodb']})
