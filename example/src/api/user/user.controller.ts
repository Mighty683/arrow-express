import { UserService } from '../../data/services/user.service';
import {GetUserById} from './routes/getUserById.route';
import {Controller, ControllerConfiguration} from "arrow-express";
import {GetMyself} from "./routes/getMyself";

export function UserController(userService: UserService): ControllerConfiguration {
  return Controller()
    .prefix('users')
    .registerRoutes(
      GetUserById(userService),
      GetMyself(userService)
    );
}

