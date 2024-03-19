import { EVENTS } from "../../constants";
import logger from "../../logger";

export function leaveTableResFormate(tableId: string, userId: string, seatIndex: number, playerState: string): any {
    try {
        return {
            "en": EVENTS.LEAVE_TABLE,
            "data": {
                "tableId": tableId,
                "userId": userId,
                "seatIndex": seatIndex,
                "playerState": playerState
            }
        };
    } catch (error) {
        logger.error("----- leaveTableResFormate :: ERROR :: ", error);
        throw error;
    }
}
