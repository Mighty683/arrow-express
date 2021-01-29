import {EventDTO, EventService} from "../../../data/services/event.service";
import {Route, RouteConfigurator} from "../../../framework/controller/Route";
import {AuthorizeGuard, UserContext} from "../../guards/authorize.guard";

export const CreateEventRoute = (eventService: EventService): RouteConfigurator => {
  return Route()
    .method('post')
    .contextGuard<UserContext>(AuthorizeGuard)
    .handler(async (req) => {
      return eventService.createEvent(req.body as EventDTO);
    });
};