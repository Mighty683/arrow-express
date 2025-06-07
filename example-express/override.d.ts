/* eslint-disable @typescript-eslint/no-empty-interface */
import "arrow-express";
import { Request, Response } from "express";

declare module "arrow-express" {
  namespace ArrowExpress {
    interface InternalRequestType extends Request {}
    interface InternalResponseType extends Response {}
  }
}
