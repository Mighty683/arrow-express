import { Controller, ControllerConfiguration, RouteConfigurator } from "arrow-express";

import { UserService } from "../../data/services/user.service";
import { GetUserByIdRoute } from "./routes/getUserById.route";
import { GetMyselfRoute } from "./routes/getMyself.route";

export function UserController(userService: UserService): ControllerConfiguration {
  return Controller().prefix("users").registerRoutes(GetUserByIdRoute(userService), GetMyselfRoute(userService));
}
