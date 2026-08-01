import t from "tap";
import { build } from "./helper.js";


t.test('can not access protected routes', async (t) => {

  const app = await build(t, {
  MONGO_URL: 'mongodb://localhost:27017/login-test-db'
  });

  const privateRoutes = ['/me'];

  for (const url of privateRoutes) {
    const response = await app.inject({
      method: 'GET',
      url
    });

    t.equal(response.statusCode, 401);
    t.same(response.json(), {
      statusCode: 401,
      error: 'Unauthorized',
      code: "FST_JWT_NO_AUTHORIZATION_IN_HEADER",
      message: 'No Authorization was found in request.headers',
    })
  }
})


t.test('register the user', async (t) => {

  const app = await build(t, {
  MONGO_URL: 'mongodb://localhost:27017/login-test-db'
  });

  const response = await app.inject({
    method: 'POST',
    url: '/register',
    payload: {
      username: 'test',
      password: '12345678'
    }
  })

  t.equal(response.statusCode, 201);
  t.same(response.json(), {registered: true})

})

t.test('successful login', async (t) => {

  const app = await build(t, {
  MONGO_URL: 'mongodb://localhost:27017/login-test-db'
  });

  const login = await app.inject({
    method: 'POST',
    url: '/authenticate',
    payload: {
      username: 'test',
      password: '12345678'
    }
  })

  t.equal(login.statusCode, 200);
  t.match(login.json(), { token: /(\w*\.){2}.*/ })

  t.test('access protected routes', async (t) => {

    const response = await app.inject({
      method: 'GET',
      url: '/me',
      headers: {
        authorization: `Bearer ${login.json().token}`
      }
    })

    t.equal(response.statusCode, 200);
    t.match(response.json(), {username: 'test'})
  })
} )
