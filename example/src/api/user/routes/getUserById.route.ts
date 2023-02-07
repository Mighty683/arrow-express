import { Route, RouteConfigurator } from "arrow-express";

import { User } from "../../../data/entities/user.entity";
import { UserService } from "../../../data/services/user.service";
import { AuthorizeGuard, UserContext } from "../../guards/authorize.guard";

export function GetUserById(userService: UserService): RouteConfigurator {
  return Route()
    .method("get")
    .path(":id")
    .handler(async (req): Promise<User> => {
      await AuthorizeGuard(req);
      return await userService.getUserById(Number(req.params.id));
    });
}
