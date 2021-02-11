import {Route, RouteConfigurator} from "arrow-express";

import {User} from '../../../data/entities/user.entity';
import {UserService} from '../../../data/services/user.service';
import {AuthorizeGuard, UserContext} from '../../guards/authorize.guard';

export function GetMyself(userService: UserService): RouteConfigurator<UserContext> {
  return Route()
    .method('get')
    .path('myself')
    .contextGuard(AuthorizeGuard)
    .handler(async (req, res, context): Promise<User> => {
      return await userService.getUserById(context.userId);
    });
}