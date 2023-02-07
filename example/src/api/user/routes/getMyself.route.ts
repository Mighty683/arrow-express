import { Route, RouteConfigurator } from "arrow-express";

import { User } from "../../../data/entities/user.entity";
import { UserService } from "../../../data/services/user.service";
import { AuthorizeGuard } from "../../guards/authorize.guard";

export function GetMyselfRoute(userService: UserService): RouteConfigurator {
  return Route()
    .method("get")
    .path("myself")
    .handler(async (req): Promise<User> => {
      const context = await AuthorizeGuard(req);
      return await userService.getUserById(context.userId);
    });
}
