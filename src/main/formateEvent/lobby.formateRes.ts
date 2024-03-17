import { EVENTS } from "../../constants";
import logger from "../../logger";

export async function lobbyFormateResponse(
    lobbyData: any
) {
    try {

        return {
            en: EVENTS.LOBBY,
            data: lobbyData
        }

    } catch (error) {
        logger.error(`----- lobbyFormateResponse :: ERROR :: `, error)
    }
}