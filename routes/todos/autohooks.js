import fastifyPlugin from "fastify-plugin";


async function todoAutohooks(fastify, opts) {
  fastify.addHook('onRequest', fastify.authenticate)
  const todos = await fastify.mongo.db.collection('todos');
  fastify.decorateRequest('todosDatasource', null);

  fastify.addHook('onRequest', async (request, reply) => {

    request.todosDatasource = {
      async createTodo({ title }) {
        const _id = new fastify.mongo.ObjectId();
        const now = new Date()
        const userId = request.user.id;
        const { insertedId } = await todos.insertOne({
          _id,
          id: _id,
          title,
          userId,
          done: false,
          createAt: now,
          modifiedAt: now
        })

        return insertedId;
      },

      async countTodos(filter = {}) {
        filter.userId = request.user.id;
        const count = await todos.countDocuments(filter);
        return count;
      },

      async listTodos({ filter = {}, projection = {}, limit = 50, skip = 0, asStream = false } = {}) {
        if (filter.title) {
          filter.title = new RegExp(filter.title)
        } else {
          delete filter.title
        }

        filter.userId = request.user.id;

        const cursor = todos.find(filter, {
          projection: { ...projection, _id: 0 },
          limit,
          skip,
        })

        if (asStream) {
          return cursor.stream();
        }

        return cursor.toArray();
      },

      async readTodo(id, projection = {}) {
        const todo = await todos.findOne({ _id: new fastify.mongo.ObjectId(id), userId: request.user.id },
          {projection: {...projection, _id: 0}})

        return todo;
      },

      async updateTodo(id, data) {
        const newTodo = await todos.updateOne(
          { _id: new fastify.mongo.ObjectId(id), userId: request.user.id },
          {
            $set: {
              ...data,
              modifiedAt: new Date(),
            }
          }
        )

        return newTodo;
      },

      async deleteTodo(id) {
        const result = await todos.deleteOne(
          { _id: new fastify.mongo.ObjectId(id), userId: request.user.id }
        )

        return result;
      }
    }
  } )
}

export default fastifyPlugin(todoAutohooks, {encapsulate: true, name: 'todo-store', dependencies:['mongodb', 'authentication-plugin']})
