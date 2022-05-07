# Arrow Express

Aim of this library is to make express applications bootstrapping easy and fast with zero configuration.

Main principles:
- Use arrow functions :)
- Avoid adding complex configuration, lib will work out of the box
- Focus on clean functional programming, avoid usage of complex additional configuration ideas like decorators etc.
- Flexibility and ease of use

## Installation
To install package use command:

`npm install arrow-express`

## Example code

```ts
import Express from 'express';
import Compression from 'compression';
import cors from 'cors';

import {Application, Controller, Route} from 'arrow-express';

const ExpressApp = Express();
  
ExpressApp.use(Express.json());
ExpressApp.use(Compression());
ExpressApp.use(cors());

Application({
  port: 8080,
  app: ExpressApp
}).registerController(
  Controller()
    .prefix('users')
    .registerRoutes(
      Route()
        .method('get')
        .handler(
          (req) => getUser(req.body.id)
        ),
      Route()
        .method('post')
        .path('create')
        .handler(
          (req) => createUser(req.body.id)
        )
    ),
).start();
/**
 * Created paths in express application:
 * GET:/users
 * POST:/users/create
 *
 * For full example application check out example folder.
 */
```
## Docs
### Application

Point of start for every application.
Here you can configure Express application or port used by your application.


#### Application Methods

- `registerController` - register controller in application.
- `start` - starts application, register controllers routes in express app and connect to configured port

#### Example usage of Application

```ts
Application({
  port: 8080,
  app: Express(),
})
.start();
```

### Controller

Controller is used to manage group of routes.

#### Example usage of Controller

```ts
import {Application, Controller} from 'arrow-express';

function LoginController () {
  return Controller()
    .prefix('login');
}

function UserController () {
  return Controller()
    .prefix('user');
}

Application({port: 8080})
  .registerControllers(
    LoginController(),
    UserController(),
  )
  .start();
```

#### Controller Methods

- `prefix(prefix)` - register controller prefix which will be used by all routes
- `registerRoute(route)` - register route in controller
- `registerRoutes(...routes)` - register multiple routes in controller
- `registerController(controller)` - register sub controller in controller
- `registerControllers(...controllers)` - register multiple sub controllers in controller

### Route

Route is used to manage route handling.

### Example usage of route

```ts
import {Application, Controller, Route} from 'arrow-express';


Application({port: 8080})
  .registerController(
    Controller()
      .prefix('user')
      .registerRoutes(
        Route()
          .method('get')
          .path('myself')
          .handler(async (req: Express.Request, res: Express.Response) => {
            const user = {};
            // Use some service to extract route
            return user;
          })
      )
  )
  .start();

// Registered path will be: GET '/user/myself'
```

#### Route Methods

- `method` - register method used for route
- `path` - register path of route alongside with prefix it is used to create full path
- `handler` - set request handler, here you can handle request
- `contextGuard` - used to add pre-checks or side operations for request if guard throw error, handler is not called

#### Route handler

Route handler receive 3 arguments:

- `request` - which is Express.Request for path
- `response` - which is Express.Response
- `context` - which is optional context returned by last guard

Features of route handler:
- Route handler can return Promise or Object which will be send back with response code 200.
- Route handler can also send response itself using `res` then library won't try to send result pf handler.
- Route handler can also setup custom response code then arrow-express won't override it.
- If route handler will throw RequestError, RequestError will be used to send back desired response.


#### Route Guard

Route Guard receive 2 arguments:

- `request` - which is Express.Request for path
- `response` - which is Express.Response

Route Guard can return context which can be used in handler later.
If route guard throw error route handler won't be called.

### Advices

Check out `example` folder for example code guidance.

#### Use closures to structure services

Good approach is to use function closures to organize code into chunks.

Eg: create function which will return `Controller` and pass to it instance of service as argument instead of importing Singleton service.
This way you will be able to test routes and controllers with ease without module mocking and you will avoid side effects.

```ts
// index.ts file
async function startServer() {
  const expressApplication = Express();
  const userService = new UserService();

  expressApplication.use(cors());
  expressApplication.use(Compression());
  expressApplication.use(Express.json());

  Application({
    port: 3000,
    app: expressApplication
  })
    .registerController(UserController(userService))
    .start();
}

// user.controller.ts file
export function UserController(userService: UserService): ControllerConfiguration {
  return Controller()
    .prefix('users')
    .registerRoutes(
      GetUserById(userService),
      GetMyselfRoute(userService)
    );
}
```
