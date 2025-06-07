// Express packages
import Express from "express";
import Compression from "compression";
import cors from "cors";

// Api packages
import { Application, ExpressAdapter } from "arrow-express";
import { UserController } from "./api/user/user.controller";

// Data packages
import { UserService } from "./data/services/user.service";

async function startServer() {
  const expressApplication = Express();
  const userService = new UserService();

  expressApplication.use(cors());
  expressApplication.use(Compression());
  expressApplication.use(Express.json());

  ExpressAdapter(expressApplication, Application().registerController(UserController(userService))).configure();
  expressApplication.listen(3001);
}

startServer();
