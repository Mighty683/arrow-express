// Express packages

// Api packages
import { Application, Controller, Route } from "arrow-express";

async function startServer() {
  console.log(
    Application()
      .registerController(
        Controller()
          .prefix("/hello")
          .registerController(
            Controller()
              .prefix("/world")
              .registerRoute(
                Route()
                  .path("/greet/:name")
                  .method("get")
                  .handler(async req => {
                    const name = req.params.name;
                    return { message: `Hello ${name}!` };
                  })
              )
          )
      )
      .buildRoutes()
  );
}

startServer();
