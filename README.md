# Arrow Express

Bootstrap your web application routing with ease.

With `arrow-express` you can easily configure your backend application routes in a framework-agnostic way.

Out of the box it supports Express applications via the `ExpressAdapter`, but the core library is designed to work with any web framework through custom adapters.

## Features

What `arrow-express` offers:

- Framework-agnostic route definition system.
- Built-in Express adapter for seamless integration with Express applications.
- Quick way to define routes in applications.
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
- TypeScript support with full type safety for request/response objects.

What `arrow-express` doesn't offer:

- It's not a replacement for web frameworks like Express.
- It's not a complete backend framework.
  - It won't take care of database connections.
  - It won't take care of authorization (but provides tools to implement it).
  - Et cetera.

## Quick Start

### Basic Example with Express

Here's a complete example showing how to create a simple API with `arrow-express`:

```ts
import Express from "express";
import { Application, Controller, Route, ExpressAdapter } from "arrow-express";

// 1. Create Express app
const app = Express();

// 2. Define your routes using arrow-express
const userController = Controller()
  .prefix("users")
  .handler(async (req, res) => {
    // This runs before every route in this controller
    // You can add authentication, logging, etc.
    return { timestamp: new Date() };
  })
  .registerRoutes(
    Route()
      .method("get")
      .path(":id")
      .handler(async (req, res, context) => {
        const userId = req.params.id;
        return { id: userId, name: "John Doe", ...context };
      }),

    Route()
      .method("get")
      .path("")
      .handler(async (req, res, context) => {
        return { users: [{ id: 1, name: "John" }], ...context };
      })
  );

// 3. Register routes with Express
const application = Application().registerController(userController);
ExpressAdapter(app, application).configure();

// 4. Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

This creates:

- `GET /users/:id` - Get user by ID
- `GET /users` - Get all users

### Framework-Agnostic Usage

You can also use `arrow-express` without Express to generate route configurations:

```ts
import { Application, Controller, Route } from "arrow-express";

const application = Application()
  .prefix("api")
  .registerController(
    Controller()
      .prefix("users")
      .registerRoute(
        Route()
          .method("get")
          .path(":id")
          .handler(async (req, res) => ({ id: req.params.id }))
      )
  );

// Get route configurations for any framework
const routes = application.buildRoutes();
console.log(routes);
// Output: [{ path: 'api/users/:id', method: 'get', handler: Function }]
```

## Installation

```bash
npm install arrow-express
```

For Express integration, you'll also need Express (if not already installed):

```bash
npm install express
npm install -D @types/express  # For TypeScript projects
```

## TypeScript Configuration

To get full type safety, configure TypeScript module augmentation:

```ts
// types.ts or at the top of your main file
import "arrow-express";
import { Request, Response } from "express";

declare module "arrow-express" {
  namespace ArrowExpress {
    interface InternalRequestType extends Request {}
    interface InternalResponseType extends Response {}
  }
}
```

This gives you proper typing for `req` and `res` parameters in your handlers.

## Core Concepts

### Application

The `Application` is the root container for your routing configuration. It's framework-agnostic and doesn't interact with any specific web framework directly.

**Key Features:**

- Register controllers and their routes
- Set application-wide prefixes
- Build route configurations for any framework
- Compose multiple controllers into a single application

```ts
import { Application } from "arrow-express";

const app = Application()
  .prefix("api/v1") // All routes will be prefixed with /api/v1
  .registerController(userController)
  .registerControllers(authController, adminController);

// Get all route configurations
const routes = app.buildRoutes();
```

**Methods:**

- `prefix(prefix: string)` - Set application-wide prefix for all routes
- `registerController(controller)` - Register a single controller
- `registerControllers(...controllers)` - Register multiple controllers
- `buildRoutes()` - Generate route configurations for framework integration

### Controller

Controllers group related routes under a common prefix and can share middleware-like handlers. They can be nested to create hierarchical route structures.

**Key Features:**

- Group routes with common prefix (e.g., `/users`, `/admin`)
- Share context between routes (authentication, logging, etc.)
- Nest controllers for complex route hierarchies
- Chain handlers for middleware-like behavior

```ts
import { Controller, Route } from "arrow-express";

const userController = Controller()
  .prefix("users")
  .handler(async (req, res) => {
    // This runs before every route in this controller
    // Perfect for authentication, logging, validation, etc.
    const user = await authenticateUser(req);
    return { user, requestId: generateId() };
  })
  .registerRoute(
    Route()
      .method("get")
      .path("profile")
      .handler(async (req, res, context) => {
        // context contains the result from controller handler
        return { profile: context.user.profile };
      })
  )
  .registerController(
    // Nested controller: /users/admin/*
    Controller()
      .prefix("admin")
      .handler(async (req, res, context) => {
        // Can access parent context and add additional context
        if (!context.user.isAdmin) {
          throw new RequestError(403, { message: "Admin required" });
        }
        return { ...context, adminAccess: true };
      })
      .registerRoute(
        Route()
          .method("get")
          .path("dashboard")
          .handler(async (req, res, context) => {
            return { dashboard: "admin data", user: context.user };
          })
      )
  );
```

**Methods:**

- `prefix(prefix: string)` - Set URL prefix for all routes in this controller
- `handler(handler)` - Set middleware function that runs before all routes
- `registerRoute(route)` - Add a single route to this controller
- `registerRoutes(...routes)` - Add multiple routes to this controller
- `registerController(controller)` - Add a nested sub-controller
- `registerControllers(...controllers)` - Add multiple nested controllers

### Route

Routes define individual endpoints with their HTTP method, path, and handler function.

**Key Features:**

- Support all HTTP methods (GET, POST, PUT, DELETE, etc.)
- Path parameters and query strings
- Access to request, response, and controller context
- Automatic response handling or manual response control

```ts
import { Route, RequestError } from "arrow-express";

const getUserRoute = Route()
  .method("get")
  .path(":id") // Path parameter
  .handler(async (req, res, context) => {
    const userId = req.params.id;

    // You can return data (automatic 200 response)
    if (userId === "me") {
      return { user: context.user };
    }

    // Or manually control the response
    if (!userId) {
      res.status(400).json({ error: "User ID required" });
      return; // Don't return data when manually responding
    }

    // Or throw errors for error handling
    const user = await findUser(userId);
    if (!user) {
      throw new RequestError(404, { message: "User not found" });
    }

    return { user };
  });

const createUserRoute = Route()
  .method("post")
  .path("")
  .handler(async (req, res, context) => {
    const userData = req.body;
    const newUser = await createUser(userData);

    // Set custom status code before returning
    res.status(201);
    return { user: newUser };
  });
```

**Methods:**

- `method(method)` - Set HTTP method ("get", "post", "put", "delete", etc.)
- `path(path)` - Set route path (supports Express-style parameters like `:id`)
- `handler(handler)` - Set the request handler function

**Handler Function:**

- Receives `(request, response, context)` parameters
- `request` - HTTP request object (typed based on your framework)
- `response` - HTTP response object (typed based on your framework)
- `context` - Result from controller handlers (authentication data, etc.)
- Can return data for automatic JSON response with 200 status
- Can manually use `response` object for custom responses
- Can throw `RequestError` for automatic error responses

### ExpressAdapter

The `ExpressAdapter` bridges `arrow-express` route configurations with Express.js applications. It handles request/response processing, error handling, and route registration.

**Key Features:**

- Automatic route registration in Express
- Built-in error handling with `RequestError`
- Request/response processing
- Route configuration logging
- Prevents double-configuration

```ts
import Express from "express";
import { Application, ExpressAdapter } from "arrow-express";

const app = Express();
const application = Application().registerController(userController);

// Configure Express with arrow-express routes
ExpressAdapter(app, application).configure();

// Start server
app.listen(3000);
```

**Methods:**

- `configure(printConfiguration = true)` - Registers all routes from the application into Express
  - `printConfiguration` - Whether to log registered routes to console (default: true)
  - Throws error if called multiple times (prevents duplicate route registration)

**Error Handling:**
The adapter automatically handles `RequestError` exceptions:

```ts
// In your route handler
throw new RequestError(404, { message: "User not found", code: "USER_NOT_FOUND" });

// Results in HTTP 404 response with JSON body:
// { "message": "User not found", "code": "USER_NOT_FOUND" }
```

## Error Handling

`arrow-express` provides built-in error handling through the `RequestError` class.

```ts
import { RequestError } from "arrow-express";

// In any route or controller handler
throw new RequestError(401, {
  message: "Authentication required",
  code: "AUTH_REQUIRED",
});

// Results in HTTP 401 response:
// { "message": "Authentication required", "code": "AUTH_REQUIRED" }
```

**RequestError Constructor:**

- `httpCode` (number) - HTTP status code (default: 500)
- `response` (object) - JSON response body

**Automatic Handling:**

- When using `ExpressAdapter`, `RequestError` exceptions are automatically caught
- The HTTP status code and response body are automatically sent
- Other errors result in 500 Internal Server Error responses

## Advanced Patterns

### Dependency Injection with Closures

Use function closures to inject dependencies and improve testability:

```ts
// services/userService.ts
export class UserService {
  async getUser(id: string) {
    /* ... */
  }
  async createUser(data: any) {
    /* ... */
  }
}

// controllers/userController.ts
export function UserController(userService: UserService) {
  return Controller()
    .prefix("users")
    .registerRoutes(
      Route()
        .method("get")
        .path(":id")
        .handler(async (req, res) => {
          const user = await userService.getUser(req.params.id);
          return { user };
        }),

      Route()
        .method("post")
        .path("")
        .handler(async (req, res) => {
          const user = await userService.createUser(req.body);
          res.status(201);
          return { user };
        })
    );
}

// index.ts
const userService = new UserService();
const application = Application().registerController(UserController(userService));
```

**Benefits:**

- Easy unit testing without module mocking
- Clear dependency management
- No singleton dependencies
- Better separation of concerns

### Authentication & Authorization

Implement authentication using controller handlers:

```ts
import { Controller, Route, RequestError } from "arrow-express";

function AuthController(authService: AuthService) {
  return Controller()
    .prefix("auth")
    .handler(async (req, res) => {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        throw new RequestError(401, { message: "Authentication required" });
      }

      const user = await authService.verifyToken(token);
      if (!user) {
        throw new RequestError(401, { message: "Invalid token" });
      }

      return { user, authenticated: true };
    })
    .registerRoutes(
      Route()
        .method("get")
        .path("profile")
        .handler(async (req, res, context) => {
          return { profile: context.user.profile };
        }),

      Route()
        .method("put")
        .path("profile")
        .handler(async (req, res, context) => {
          const updatedUser = await authService.updateProfile(context.user.id, req.body);
          return { user: updatedUser };
        })
    );
}
```

### Nested Route Hierarchies

Create complex route structures with nested controllers:

```ts
const apiController = Controller()
  .prefix("api/v1")
  .handler(async (req, res) => {
    // Global API middleware (rate limiting, logging, etc.)
    return { apiVersion: "v1", requestId: generateId() };
  })
  .registerControllers(
    // /api/v1/users/*
    Controller()
      .prefix("users")
      .handler(authenticateUser)
      .registerControllers(
        // /api/v1/users/admin/*
        Controller()
          .prefix("admin")
          .handler(requireAdmin)
          .registerRoute(Route().method("get").path("dashboard").handler(getAdminDashboard)),

        // /api/v1/users/profile/*
        Controller()
          .prefix("profile")
          .registerRoutes(
            Route().method("get").path("").handler(getProfile),
            Route().method("put").path("").handler(updateProfile)
          )
      ),

    // /api/v1/public/*
    Controller()
      .prefix("public")
      .registerRoute(
        Route()
          .method("get")
          .path("health")
          .handler(async () => ({ status: "ok" }))
      )
  );
```

## Migration from v3.x

If you're upgrading from v3.x, here are the key changes:

1. **Express is now optional**: Install Express separately if needed
2. **ExpressAdapter is required**: Use `ExpressAdapter(app, application).configure()` instead of direct Express integration
3. **Framework-agnostic core**: The core library no longer depends on Express

**Before (v3.x):**

```ts
import { Application } from "arrow-express";
// Express was a required dependency
```

**After (v4.x):**

```ts
import { Application, ExpressAdapter } from "arrow-express";
import Express from "express";

const app = Express();
const application = Application().registerController(controller);
ExpressAdapter(app, application).configure(); // New adapter pattern
```

## Examples

Check out the `example-express` and `example-no-express` folders in the repository for complete working examples:

- **example-express**: Full Express.js integration with authentication, services, and controllers
- **example-no-express**: Framework-agnostic usage for generating route configurations

## Contributing

Contributions are welcome! Please read the contributing guidelines and submit pull requests to the [GitHub repository](https://github.com/Mighty683/arrow-express).

## License

MIT © [Soldev - Tomasz Szarek](https://github.com/Mighty683)
