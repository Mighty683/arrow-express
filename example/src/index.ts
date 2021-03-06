// Express packages
import Express from 'express';
import Compression from 'compression';
import BodyParser from 'body-parser';
import cors from 'cors';

// Api packages
import {Application} from "arrow-express";
import {UserController} from "./api/user/user.controller";

// Data packages
import { UserService } from './data/services/user.service';

async function startServer() {
  const expressApplication = Express();
  const userService = new UserService();

  expressApplication.use(cors());
  expressApplication.use(Compression());
  expressApplication.use(BodyParser());

  Application({
    port: 3000,
    app: expressApplication
  })
    .registerController(UserController(userService))
    .start();
}

startServer();