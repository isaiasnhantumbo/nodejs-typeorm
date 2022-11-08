import { Router } from "express";

import { RoomController } from './controllers/RoomController';
import { SubjectController } from "./controllers/SubjectController";

export const routes = Router();

routes.post("/subject", new SubjectController().create);
routes.post("/room", new RoomController().create);
routes.get("/room", new RoomController().listRooms);
routes.post("/room/:roomId", new RoomController().createVideo);
routes.post("/room/:roomId/subject", new RoomController().createRoomSubject)
