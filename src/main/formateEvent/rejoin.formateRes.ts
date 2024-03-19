import { EVENTS } from "../../constants";
import { timeDifference } from "../utils/timeDifference";

export function rejoinResFormate(tableData: any, userId: string, timer: number): any {
    try {
        const remainTime = timeDifference(
            new Date(),
            tableData["updateAt"],
            timer
        );

        return {
            "en": EVENTS.REJOIN,
            "data": {
                "timer": remainTime,
                "currentPlayerId": tableData["currentTurnUserId"],
                "currentPlayerIndex": tableData["currentTurnIndex"],
                "tableState": tableData["tableState"],
                "dealerIndex": tableData["dealerIndex"],
                "dealerUserId": tableData["dealerUserId"],
                "players": tableData["players"],
                "gameBoard": tableData["gameBoard"],
                "userId": userId,
            }
        };
    } catch (error) {
        console.log("----- rejoinResFormate :: ERROR :: ", error);
    }
}
