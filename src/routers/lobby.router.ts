import express from "express";
import { createLobbyValidator } from "../validators/lobby.validation";
import { createLobby, getLobby } from "../controllers/lobby.controller";
const router = express.Router();

router.post("/lobby", createLobbyValidator(), createLobby)
router.get("/lobby", getLobby)

export default router;
