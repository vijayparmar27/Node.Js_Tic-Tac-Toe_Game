import { EVENTS } from "../../constants";
import logger from "../../logger";

export function turnResFormate(turnPlayerData: any, tableId: string, turnTime: number): any {
    try {
        return {
            "en": EVENTS.TURN,
            "data": {
                "tableId": tableId,
                "totalTurnTimer": 30,
                "turnTime": turnTime,
                "playerState": turnPlayerData["playerState"],
                "playerId": turnPlayerData["userId"],
                "seatIndex": turnPlayerData["seatIndex"],
            }
        };
    } catch (error) {
        logger.error("------ turnResFormate :: ERROR :: ", error);
        throw error;
    }
}
