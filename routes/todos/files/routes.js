import fastifyMultipart from "@fastify/multipart";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify";



export default async function fileTodoRoutes(fastify, opts){

  await fastify.register(fastifyMultipart, {

    attachFieldsToBody: true,
    sharedSchemaId: "schema:todo:import:file",
    limits: {
      fieldNameSize: 50,
      fieldSize: 100,
      fields: 10,
      fileSize: 1_000_000,
      files: 1
    },

    async onFile(part) {

      const lines = [];

      const stream = part.file.pipe(parse({
        bom: true,
        trim: true,
        skip_empty_lines: true,
        columns: true
      }))

      for await (const line of stream) {
        lines.push({
          title: line.title,
          done: line.done === 'true',
        })
      }

      part.value = lines;

    }
  })

  // fastify.addHook('preValidation', async (request, reply) => {
  //   console.log(request.body.todoListFile);
  // })
  fastify.route({
    method: 'POST',
    url: '/import',
    schema: {
          body:{
                  type: 'object',
                  required: ['todoListFile'],
                  description: 'Import a todo list from a CSV file with the following format: title,done',
                  properties: {
                    todoListFile: {
                      $ref: 'schema:todo:import:file',
                    }
                  }
                },
          response: {
            201: {
              type: 'array',
              items: fastify.getSchema('schema:todo:create:response')
            }
          }
        },
    handler: async function importHandler(request, reply) {
      const inserted = await request.todosDatasource.createTodos(request.body.todoListFile.value)

      reply.code(201);
      return inserted;
    }
  })


  fastify.route({
    method: "GET",
    url: '/export',
    schema: {
      queryString: {
        type: 'object',
        additionalProperties: false,
        properties: {
          title: {
            type: 'string'
          }
        }
      }
    },
    handler: async function exportHandler(request, reply) {
      const { title } = request.query;
      const cursor = await request.todosDatasource.listTodos({ filter: { title }, skip: 0, limit: undefined, asStream: true });

      reply.header('Content-Disposition', 'attachment; filename="todo-list.csv"')
      reply.type('text/csv');

      return cursor.pipe(stringify({
        quoted_string: true,
        header: true,
        columns: ['title', 'done', 'id', 'createdAt', 'modifiedAt'],
        cast: {
          boolean: (value) => value ? 'true' : 'false',
          date: (value) => value.toISOString()
        }
      }))
    }
  })
}
