import {User} from '../../../data/entities/user.entity';
import {UserService} from '../../../data/services/user.service';
import {AuthorizeGuard, UserContext} from '../../guards/authorize.guard';
import {Route, RouteConfigurator} from "arrow-express";

export function GetUserById(userService: UserService): RouteConfigurator<UserContext> {
  return Route()
    .method('get')
    .path(':id')
    .contextGuard(AuthorizeGuard)
    .handler(async (req): Promise<User> => {
      console.log(req.params);
      return await userService.getUserById(Number(req.params.id));
    });
}