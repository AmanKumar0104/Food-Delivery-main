import express from "express";
import { startGroupOrder, joinGroupOrder, addItemToGroup, removeItemFromGroup, getGroupData, sendGroupMessage } from "../controllers/groupOrderController.js";

const groupOrderRouter = express.Router();

groupOrderRouter.post("/start", startGroupOrder);
groupOrderRouter.post("/join", joinGroupOrder);
groupOrderRouter.post("/add", addItemToGroup);
groupOrderRouter.post("/remove", removeItemFromGroup);
groupOrderRouter.get("/data/:groupId", getGroupData);
groupOrderRouter.post("/message", sendGroupMessage);

export default groupOrderRouter;
