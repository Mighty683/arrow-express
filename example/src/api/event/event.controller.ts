import {Controller, ControllerConfiguration} from "../../framework/controller/Controller";
import {EventService} from "../../data/services/event.service";
import {CreateEventRoute} from "./routes/createEvent.route";
import {GetAllEvents} from "./routes/getAllEvents.route";

export const EventController = (eventService: EventService): ControllerConfiguration => {
  return Controller()
    .prefix('events')
    .registerRoutes(
      CreateEventRoute(eventService),
      GetAllEvents(eventService)
    );
};