import { Route, RouteConfigurator } from "arrow-express";

import { User } from "../../../data/entities/user.entity";
import { UserService } from "../../../data/services/user.service";
import { UserContext } from "../../guards/authorize.guard";

export function GetUserByIdRoute(userService: UserService): RouteConfigurator<UserContext, User> {
  return Route<UserContext, User>()
    .method("get")
    .path(":id")
    .handler(async (req): Promise<User> => {
      return await userService.getUserById(Number(req.params.id));
    });
}
