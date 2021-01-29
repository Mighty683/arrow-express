import {EventService} from "../../../data/services/event.service";
import {Route, RouteConfigurator} from "../../../framework/controller/Route";
import {AuthorizeGuard} from "../../guards/authorize.guard";
import {Event} from "../../../data/entities/event.entity";

export const GetAllEvents = (eventService: EventService): RouteConfigurator => {
  return Route()
    .method('get')
    .contextGuard(AuthorizeGuard)
    .handler((): Promise<Event[]> => {
      return eventService.getEvents();
    });
};