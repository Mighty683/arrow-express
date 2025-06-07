/* eslint-disable @typescript-eslint/no-empty-interface */
import "arrow-express";

declare module "arrow-express" {
  namespace ArrowExpress {
    interface InternalRequestType {
      params: Record<string, string>;
    }
    interface InternalResponseType {
      status: (code: number) => this;
    }
  }
}
