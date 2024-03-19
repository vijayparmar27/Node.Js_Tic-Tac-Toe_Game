import logger from "../../../logger";
import { PlayingTableModel } from "../../../models/playingTable.model";
import mongoService from "../../../services/mongo.service";
import BullScheduler from "../../bull";
import { turnResFormate } from "../../formateEvent/turn.formateRes";
import { SocketEventSend } from "../../socket";
import { nextIndex } from "../../utils/nextIndex";


export async function changeTurn(currentPlayerUserId: string, currentPlayerSeatIndex: number, tableId: string): Promise<void> {
    try {
        logger.info("------ changeTurn :: currentPlayerUserId :: ", currentPlayerUserId);
        logger.info("------ changeTurn :: currentPlayerSeatIndex :: ", currentPlayerSeatIndex);

        const tableData = await mongoService.findOneAndUpdate(
            PlayingTableModel, {
            query: {
                "_id": mongoService.ObjectId(tableId),
                "players.userId": currentPlayerUserId
            },
            updateData: {
                "$inc": {
                    "players.$[element].turnMissCount": 1
                }
            },
            updateOptions: {
                "arrayFilters": [{ "element.userId": currentPlayerUserId, "element.isTakeTurn": false }],
                "returnDocument": "after"
            }
        }
        );

        logger.info("------ changeTurn :: tableData :: ", tableData);

        const nextPlayerTurn = await nextIndex(currentPlayerSeatIndex, tableData["maxPlayers"]);
        logger.info("------ changeTurn :: nextPlayerTurn :: ", nextPlayerTurn);

        let turnPlayerData: any = {};
        for (const player of tableData["players"]) {
            if (player && "userId" in player) {
                if (player["seatIndex"] === nextPlayerTurn) {
                    turnPlayerData = {
                        "userId": player["userId"],
                        "seatIndex": player["seatIndex"],
                        "playerState": player["playerState"]
                    };
                    break;
                }
            }
        }

        await mongoService.findOneAndUpdate(
            PlayingTableModel,
            {
                query: {
                    "_id": mongoService.ObjectId(tableId)
                },
                updateData: {
                    "$set": {
                        "currentTurnUserId": turnPlayerData["userId"],
                        "currentTurnIndex": turnPlayerData["seatIndex"],
                        "updateAt": new Date(),
                        [`players.${currentPlayerSeatIndex}.isTakeTurn`]: false
                    }
                }
            });

        const turnRes = turnResFormate(turnPlayerData, tableId, 30);
        await SocketEventSend.sendEventToRoom(tableId, turnRes);

        BullScheduler.addJob.turnTimerQueue({
            "timer": 30 * 1000,
            "tableId": tableId,
            "turnPlayerId": turnPlayerData["userId"],
            "turnPlayerSeatIndex": turnPlayerData["seatIndex"]
        });

    } catch (error) {
        logger.error("------ changeTurn :: ERROR :: ", error);
    }
}