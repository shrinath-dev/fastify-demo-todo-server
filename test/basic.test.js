import t from "tap";
import { build } from "./helper.js";

t.test('the application should start', async (t) => {

  const app = await build(t, {
      MONGO_URL: 'mongodb://localhost:27017/basis-test-db'
    })
  await app.ready();

  t.pass('the application is ready');
});



t.test('the alive routes are online.', async (t) => {

  const app = await build(t, {
      MONGO_URL: 'mongodb://localhost:27017/basis-test-db'
    });

  const response = await app.inject({
    method: 'GET',
    url: '/'
  })

  t.same(response.json(), { root: true });
});




t.test('the application should not start', async mainTest => {

  mainTest.test('if there are missing env vars', async t => {
    try {
      await build(t, {
        NODE_ENV: 'test',
        MONGO_URL: undefined
      })

      t.fail('the server must not start');
    } catch (error) {
      t.ok(error, 'error must be set');
      t.match(error.message, "required property 'MONGO_URL'")
    }
  })


  mainTest.test('when mongodb is unreachable', async (t) => {

    try {
      await build(t, {
        NODE_ENV: 'test',
        MONGO_URL: "mongodb://localhost:27099/test",
      })
      t.fail('the server must not start');
    } catch (err) {
      t.ok(err, 'error must be set');
      t.match(err.message, "connect ECONNREFUSED")
    }
  })
});
