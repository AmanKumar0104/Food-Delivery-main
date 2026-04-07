
import express from "express";
import { submitContact, getContacts, deleteContact } from "../controllers/contactController.js";

const contactRouter = express.Router();

contactRouter.post("/submit", submitContact);
contactRouter.get("/list", getContacts);
contactRouter.post("/delete", deleteContact);

export default contactRouter;
