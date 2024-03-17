import { matchMakeReqDataIf } from "../../../@types/eventRequest";
import { MESSAGES } from "../../../constants";
import logger from "../../../logger";
import LobbyModel from "../../../models/lobby.model";
import mongoService from "../../../services/mongo.service";
import { commonPopupFormat } from "../../formateEvent/commonPopup.formate";
import { matchMaking } from "../../gamePlay/matchMake/matchMake";
import { SocketEventSend } from "../../socket";

export async function matchMakeHandler(
    { data }: matchMakeReqDataIf,
    socket: any,
    ack: Function
) {
    try {

        logger.info(`------ matchMakeHandler :: data :: `, data);

        const lobbyData = await mongoService.findOne(LobbyModel, {
            query: {
                "_id": data?.lobbyId
            }
        })

        logger.info(`------ matchMakeHandler :: lobbyData :: `, lobbyData);

        if (!lobbyData) {
            const res = commonPopupFormat("lobby Data not availble !", 1, [MESSAGES.ALERT.BUTTON_TEXT.EXIT], [
                MESSAGES.ALERT.BUTTON_COLOR.RED], [MESSAGES.ALERT.BUTTON_METHOD.EXIT]);
            await SocketEventSend.sendEventToClient(res, socket);

            return
        }

        await matchMaking(lobbyData, socket, ack)

    } catch (error) {
        logger.error(`------ matchMakeHandler :: ERROR :: `, error)
    }
}