import { TABLE_STATE } from "../../../constants/tableState";
import { PlayingTableModel } from "../../../models/playingTable.model";
import mongoService from "../../../services/mongo.service";
import BullScheduler from "../../bull";
import { turnResFormate } from "../../formateEvent/turn.formateRes";
import { SocketEventSend } from "../../socket";
import { nextIndex } from "../../utils/nextIndex";

export async function firstTurn(tableId: string): Promise<void> {
    try {
        console.log("------ firstTurn :: tableId :: ", tableId);
        const tableData = await mongoService.findOne(
            PlayingTableModel,
            {
                query: {
                    "_id": mongoService.ObjectId(tableId)
                }
            }
        );
        console.log("------ firstTurn :: tableData :: ", tableData);

        const turnplayerIndex = await nextIndex(tableData["dealerIndex"], tableData["maxPlayers"]);
        console.log("------ firstTurn :: turnplayerIndex :: ", turnplayerIndex);

        let turnPlayerData: any = {};
        for (const player of tableData["players"]) {
            if (player && "userId" in player) {
                if (player["seatIndex"] === turnplayerIndex) {
                    turnPlayerData = {
                        "userId": player["userId"],
                        "seatIndex": player["seatIndex"],
                        "playerState": player["playerState"]
                    };
                }
            }
        }

        // update tableData 
        const updateTableData = await mongoService.findOneAndUpdate(
            PlayingTableModel,
            {
                query: {
                    "_id": mongoService.ObjectId(tableId)
                },
                updateData: {
                    "$set": {
                        "currentTurnUserId": turnPlayerData["userId"],
                        "currentTurnIndex": turnPlayerData["seatIndex"],
                        "tableState": TABLE_STATE.PLAYING_START,
                        "updateAt": new Date()
                    }
                },
                updateOptions : {
                    returnDocument : "after"
                }
            }
        );

        // send turn event
        const turnRes = turnResFormate(turnPlayerData, tableId, 30);
        await SocketEventSend.sendEventToRoom(tableId, turnRes);

        // add scheduler
        BullScheduler.addJob.turnTimerQueue({
            "timer": 30 * 1000,
            "tableId": tableId,
            "turnPlayerId": turnPlayerData["userId"],
            "turnPlayerSeatIndex": turnPlayerData["seatIndex"]
        })
        
    } catch (error) {
        console.log("------ firstTurn :: ERROR :: ", error);
    }
}
