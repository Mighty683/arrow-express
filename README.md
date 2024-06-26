# Arrow Express

Boostrap your express application with ease.

With `arrow-express` you can easily configure your express application routes.

## Features

What `arrow-express` offers:

- Quick way to define routes in express applications.
- Define common routes properties by controllers.
  - Define common prefix for routes grouped under controller.
  - Define common context for routes grouped under controller. Eg: authorize user.
  - Nest controllers.
- Quickly define route by chaining methods.
  - Define method.
  - Define path.
  - Define handler.
    - In handler have access to request, response and context from controller.
- Error handling.
  - Throw `RequestError` to send back desired response with code.

What `arrow-express` doesn't offer:

- It's not a replacement for express.
- It's not backend framework.
  - It won't take care of database connections.
  - It won't take care of authorization.
  - Et cetera.

## Example

```ts
/**
 * Configure express application with arrow-express library.
 * GET /user/:id
 * GET /users
 */

import Express from "express";

import { Application, Controller, Route } from "arrow-express";

const ExpressApp = Express();

function start() {
  const application = Application({
    app: ExpressApp,
  })
    .registerController(usersController)
    .configure();

  ExpressApp.listen(3000);
}

const usersController = Controller()
  .prefix("user")
  .handler(authorizeUser)
  .registerRoutes(getUserByIdRoute, getUsersRoute);

const getUserByIdRoute = Route()
  .method("get")
  .path(":id")
  .handler(async (req, res, authorizedUser) => {
    // ...
  });

const getUsersRoute = Route()
  .method("get")
  .path("")
  .handler(async (req, res, authorizedUser) => {
    // ...
  });

function authorizeUser(req, res) {
  // Authorize user
  return { id: 1, name: "John Doe" };
}
```

## Installation

To install package use command:

`npm install arrow-express`

## Docs

### Application

Point of start for every application.
It is used to register controllers and routes.

#### Example usage of application

```ts
import Express from "express";

import { Application, Controller, Route } from "arrow-express";

const ExpressApp = Express();

const application = Application({
  app: ExpressApp,
})
  .registerController(
    Controller()
      .prefix("user")
      .registerRoute(
        Route()
          .method("get")
          .handle(async (req, res) => {
            // get user and response
          })
      )
  )
  .configure();

ExpressApp.listen(3000);
```

#### Application Methods

- `registerController` - register controller in application.
- `configure` - register routes in express app.

### Controller

Controller is used to manage group of routes under one prefix route.

#### Example usage of Controller

```ts
import { Application, Controller } from "arrow-express";

function UserController() {
  return Controller()
    .prefix("user")
    .registerRoute(
      Route()
        .method("get")
        .handle((req, res) => {
          // get user and response
        })
    );
}

Application({
  app: ExpressApp,
})
  .registerControllers(UserController())
  .configure();

// Registered path will be: GET '/user'
```

#### Controller Methods

- `handler(handler)` - register controller handler which will be used by all routes
- `prefix(prefix)` - register controller prefix which will be used by all routes
- `registerRoute(route)` - register route in controller
- `registerRoutes(...routes)` - register multiple routes in controller
- `registerController(controller)` - register sub controller in controller
- `registerControllers(...controllers)` - register multiple sub controllers in controller

#### Controller handler

Controller handler can be used to eg: authorize user and get it's context which will be passed to routes. Handlers like controllers can be chained.

### Route

Route is used to manage route handling.

### Example usage of route

```ts
import { Application, Controller, Route } from "arrow-express";

Application({
  app: ExpressApp,
})
  .registerController(
    Controller()
      .prefix("user")
      .registerRoutes(
        Route()
          .method("get")
          .path("myself")
          .handler(async (req: Express.Request, res: Express.Response) => {
            const user = {};
            // Use some service to extract route
            return user;
          })
      )
  )
  .configure();

// Registered path will be: GET '/user/myself'
```

#### Route Methods

- `method` - register method used for route
- `path` - register path of route alongside with prefix it is used to create full path
- `handler` - set request handler, here you can handle request

#### Route handler

Route handler receive 3 arguments:

- `request` - which is Express.Request for path
- `response` - which is Express.Response
- `context` - which is resolution of controller's handler

Features of route handler:

- Route handler can return Promise or Object which will be send back with response code 200.
- Route handler can also send response itself using `res` then library won't try to send result pf handler.
- Route handler can also setup custom response code then arrow-express won't override it.
- If route handler will throw RequestError, RequestError will be used to send back desired response.

### Error handling

If route handler throws `RequestError` it will be handled by `arrow-express` and respond with http code and response object.

```ts
import { RequestError } from "arrow-express";

throw new RequestError(401, {
  code: 401,
  message: "Unauthorized",
});
```

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

  Application({
    app: expressApplication,
  })
    .registerController(UserController(userService))
    .configure();

  expressApplication.listen(3000);
}

// user.controller.ts file
export function UserController(userService: UserService): ControllerConfiguration {
  return Controller().prefix("users").registerRoutes(GetUserById(userService), GetMyselfRoute(userService));
}
```
