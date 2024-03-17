import { EVENTS } from "../../constants";
import logger from "../../logger";

export function matchMakingResFormate(tableData: any, userId: string): any {
    try {
        const data = {
            "tableId": String(tableData["_id"]),
            "tableState": tableData["tableState"],
            "bootValue": tableData["bootValue"],
            "winAmount": tableData["potValue"],
            "players": tableData["players"],
            "currentPlayerId": userId
        };
        return {
            "en": EVENTS.MATCH_MAKE,
            "data": data
        };
    } catch (error) {
        logger.info("------- matchMakingResFormate :: ERROR :: ", error);
        return null;
    }
}
