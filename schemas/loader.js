import dotenv from './env/env-schema.json' with {type: 'json'}
import createTodoBody from './todos/create-todo-body.json' with {type: 'json'};
import changeStatusParams from './todos/change-status-params.json' with {type: 'json'}
import limit from './todos/limit.json' with {type: 'json'}
import skip from './todos/skip.json' with {type: "json"};
import todoListQuery from './todos/todo-list-query.json' with {type: "json"};
import todo from './todos/todo.json' with {type: "json"};
import todoListResponse from './todos/todo-list-response.json' with {type: 'json'};
import fastifyPlugin from 'fastify-plugin'
import todoCreateResponse from './todos/todo-create-response.json' with {type: 'json'};
import todoReadQuery from './todos/todo-read-query.json' with {type: 'json'};
import todoUpdateQueryBody from './todos/todo-update-query-body.json' with {type: 'json'};

async function loader(fastify, opts) {
  fastify.addSchema(dotenv)
  fastify.addSchema(createTodoBody);
  fastify.addSchema(changeStatusParams);
  fastify.addSchema(limit);
  fastify.addSchema(skip);
  fastify.addSchema(todoListQuery);
  fastify.addSchema(todoCreateResponse);
  fastify.addSchema(todo);
  fastify.addSchema(todoListResponse);
  fastify.addSchema(todoReadQuery);
  fastify.addSchema(todoUpdateQueryBody);
}

export default fastifyPlugin(loader);
