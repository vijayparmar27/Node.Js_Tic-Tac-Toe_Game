import logger from "../../../logger";
import LobbyModel from "../../../models/lobby.model";
import mongoService from "../../../services/mongo.service";
import { lobbyFormateResponse } from "../../formateEvent/lobby.formateRes";
import { SocketEventSend } from "../../socket";

export async function lobbyHandler(
    { data }: any,
    socket: any,
    ack: Function
) {
    try {

        const lobbyData = await mongoService.find(LobbyModel);
        logger.info(`------ lobbyHandler :: lobbyData :: `, lobbyData);

        const formateRes = await lobbyFormateResponse(lobbyData);

        await SocketEventSend.sendEventToClient(formateRes, socket);

        return;


    } catch (error) {
        logger.error(`----- lobbyHandler  :: ERROR :: `, error)
    }
}