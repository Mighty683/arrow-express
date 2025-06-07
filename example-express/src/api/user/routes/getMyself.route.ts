import { Route, RouteConfigurator } from "arrow-express";

import { User } from "../../../data/entities/user.entity";
import { UserService } from "../../../data/services/user.service";
import { UserContext } from "../../guards/authorize.guard";

export function GetMyselfRoute(userService: UserService): RouteConfigurator<UserContext, User> {
  return Route<UserContext, User>()
    .method("get")
    .path("myself")
    .handler(async (req, res, context): Promise<User> => {
      return await userService.getUserById(context.userId);
    });
}
