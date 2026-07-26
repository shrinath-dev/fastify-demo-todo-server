/*
interface for todo items
interface Todo
_id: ObjectId, // [1]
id: ObjectId, // [2]
title: string, // [3]
done: boolean, // [4]
createdAt: Date, // [5]
modifiedAt: Date, // [6]
}
*/




/**
 *
 * @param {*} fastify
 * @param {*} _opts
 */
export default async function todoRoutes(fastify, _opts) {

  const todos = fastify.mongo.db.collection('todos');


  fastify.route({
    method: 'GET',
    schema: {
      querystring: fastify.getSchema('schema:todo:list:query'),
      response: {
        200: fastify.getSchema('schema:todo:list:response')
      }
    },
    url: '/',
    handler: async function listTodos(request, reply) {

      const { title, skip, limit } = request.query;

      const { data, totalCount } = await this.mongoDataSource.listTodos({ title, skip, limit })
      reply.code(200);
      return { data, totalCount };

    }
  })

  fastify.route({
    method: 'POST',
    schema: {
      body: fastify.getSchema('schema:todo:create:body'),
      response: {
        201: fastify.getSchema('schema:todo:create:response')
      }
    },
    url: '/',
    handler: async function createTodo(request, reply) {
      const insertedId = await this.mongoDataSource.createTodo(request.body);
      reply.code(201);
      return { id: insertedId };
    }
  });


  fastify.route({
    method: 'GET',
    schema: {
      params: fastify.getSchema('schema:todo:read:query'),
      response: {
        200: fastify.getSchema('schema:todo')
      }
    },
    url: '/:id',
    handler: async function readTodo(request, reply) {
      const todo = await this.mongoDataSource.readTodo(request.params.id );
      if (!todo) {
        reply.code(404)
        return { error: "todo not found" }
      }

      return todo;
    }
  })


  fastify.route({
    method: 'PUT',
    schema: {
      params: fastify.getSchema('schema:todo:read:query'),
      body: fastify.getSchema('schema:todo:update:query:body')
    },
    url: '/:id',
    handler: async function updateTodo(request, reply) {

      const result = await this.mongoDataSource.updateTodo(request.params.id, request.body)
      if (!result) {
        reply.code(404)
        return { error: 'todo not found' }
      }

      reply.code(204)
    }
  })

  fastify.route({
    method: 'DELETE',
    schema: {
      params: fastify.getSchema('schema:todo:read:query')
    },
    url: '/:id',
    handler: async function deleteTodo(request, reply) {
      const result = await this.mongoDataSource.deleteTodo(request.params.id);
      if (!result) {
        reply.code(404);
        return { error: 'to do not found' }
      }

      reply.code(204);
    }
  })

  fastify.route({
    method: 'POST',
    schema: {
      params: fastify.getSchema('schema:todo:status:change:req:params')
    },
    url: '/:id/:status',
    handler: async function changeStatus(request, reply) {
      const done = request.params.status === 'done';
      const res = await this.mongoDataSource.updateTodo(request.params.id, { done: done });
      if (!res) {
        reply.code(404)
        return { error: 'todo not found' }
      }
      reply.code(204);
    }
  })
}
