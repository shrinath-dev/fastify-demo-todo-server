import fastifyPlugin from "fastify-plugin";


async function todoAutohooks(fastify, opts) {

  const todos = await fastify.mongo.db.collection('todos');

  fastify.decorate('mongoDataSource', {
    async createTodo({ title }) {

      const _id = new fastify.mongo.ObjectId();
      const now = new Date()
      const { insertedId } = await todos.insertOne({
        _id,
        id: _id,
        title,
        done: false,
        createAt: now,
        modifiedAt: now
      })

      return insertedId;
    },


    async listTodos({ title, skip, limit }) {

      const filter = title ? { title: new RegExp(title, 'i') } : {};

      const data = await todos.find(filter, {
        skip,
        limit
      }).toArray();

      const totalCount = await todos.countDocuments(filter)

      return { data, totalCount };
    },


    async readTodo(id) {

      const todo = await todos.findOne(
        { _id: new fastify.mongo.ObjectId(id) },
        {projection: {_id: 0}}
      )

      return todo;
    },


    async updateTodo(id, data) {

      const result = await todos.updateOne(
        { _id: new fastify.mongo.ObjectId(id) },
        {
          $set: {
            ...data,
            modifiedAt: new Date()
        }}
      )

      if (result.modifiedCount === 0) {
        return false
      }

      return true
    },


    async deleteTodo(id) {

      const result = await todos.deleteOne(
        { _id: new fastify.mongo.ObjectId(id) }
      )

      if (result.deletedCount === 0) {
        return false
      }
      return true;
    },


    // async changeStatus(id, done) {

    //   const result = await todos.updateOne(
    //     { _id: new fastify.mongo.ObjectId(id) },
    //     {
    //       $set: {
    //         done,
    //         modifiedAt: new Date(),
    //     }}
    //   )

    //   if (result.modifiedCount === 0) {
    //     return false
    //   }
    //   return true;
    // }
  })
}

export default fastifyPlugin(todoAutohooks, {encapsulate: true, name: 'todo-store', dependencies:['mongodb']})
