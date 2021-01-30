import {Controller, ControllerConfiguration, RouteConfigurator} from "arrow-express";

import { UserService } from '../../data/services/user.service';
import {GetUserById} from './routes/getUserById.route';
import {GetMyself} from "./routes/getMyself";

export function UserController(userService: UserService): ControllerConfiguration {
  return Controller()
    .prefix('users')
    .registerRoutes(
      GetUserById(userService),
      GetMyself(userService)
    );
}

