import { EVENTS } from "../../constants";
import logger from "../../logger";

export function scoreboardResFormate(tableData: any, time: number): any {
    try {
        const playersDetails: any[] = [];
        for (const player of tableData["players"]) {
            const info = {
                "userId": player["userId"],
                "userName": player["userName"],
                "seatIndex": player["seatIndex"],
                "playerState": player["playerState"],
                "symbol": player["symbol"]
            };
            playersDetails.push(info);
        }

        return {
            "en": EVENTS.SCORE_BOARD,
            "data": {
                "tableId": tableData["_id"].toString(),
                "time": time,
                "playersDetails": playersDetails
            }
        };
    } catch (error) {
        logger.error("----- scoreboardResFormate :: ERROR :: ", error);
        throw error;
    }
}
