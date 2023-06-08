import { Controller, ControllerConfiguration } from "arrow-express";

import { UserService } from "../../data/services/user.service";
import { GetUserByIdRoute } from "./routes/getUserById.route";
import { GetMyselfRoute } from "./routes/getMyself.route";
import { AuthorizeGuard } from "../guards/authorize.guard";

export function UserController(userService: UserService): ControllerConfiguration {
  return Controller()
    .handler(AuthorizeGuard)
    .prefix("users")
    .registerRoutes(GetUserByIdRoute(userService), GetMyselfRoute(userService));
}
