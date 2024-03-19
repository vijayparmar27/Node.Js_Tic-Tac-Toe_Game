import { MESSAGES } from "../../../constants";
import { TABLE_STATE } from "../../../constants/tableState";
import { PlayingTableModel } from "../../../models/playingTable.model";
import mongoService from "../../../services/mongo.service";
import { centerToastPopupFormat } from "../../formateEvent/commonPopup.formate";
import { leaveTableResFormate } from "../../formateEvent/leaveTable.formateRes";
import { SocketEventSend } from "../../socket";
import { removeFromQueue } from "../../utils/manageTableQueue";
import { addBalance } from "../../utils/updateBalance";
import { scoreboard } from "../scoreboard/scoreboard";

export async function leaveTable(tableId: string, userId: string, seatIndex: number): Promise<void> {
    try {
        const tableData = await mongoService.findOne(
            PlayingTableModel,
            {
                query: {
                    "_id": mongoService.ObjectId(tableId)
                }
            }
        );
        console.log("------ leaveTable :: tableData :: ", tableData);
        console.log("------ leaveTable :: tableData['tableState'] :: ", tableData["tableState"]);

        // check table state
        if (tableData["tableState"] === TABLE_STATE.WATING_PLAYER && tableData["activePlayers"] === 1) {
            // remove Queue
            await removeFromQueue(tableData["lobbyId"], tableId);
            // send leave event
            const leaveTableRes = leaveTableResFormate(
                tableId,
                userId,
                seatIndex,
                tableData["players"][seatIndex]["playerState"]
            );

            await SocketEventSend.sendEventToRoom(tableId, leaveTableRes);
            // remove from room
            await SocketEventSend.leaveClientInRoom(tableData["players"][seatIndex]["socketId"], tableId);

            // add balance
            await addBalance(userId, tableData["bootValue"]);

            await mongoService.deleteOne(
                PlayingTableModel,
                {
                    query: {
                        "_id": mongoService.ObjectId(tableId)
                    }
                }
            );
        } else if (
            tableData["tableState"] === TABLE_STATE.ROUND_TIMER_START ||
            tableData["tableState"] === TABLE_STATE.COLLECT_BOOT ||
            tableData["tableState"] === TABLE_STATE.SELECT_DEALER
        ) {
            // send popup
            const popup_res = centerToastPopupFormat(
                "Round start in 0 second",
                MESSAGES.ALERT.TYPE.MIDDLE_TOAST_POPUP,
                3
            );
            console.log("------>> matchMaking :: popup_res ::", popup_res);
            await SocketEventSend.sendEventToRoom(tableId, popup_res);

            // Continue with the logic as needed
            // pass
        } else if (tableData["tableState"] === TABLE_STATE.PLAYING_START) {
            const leaveTableRes = leaveTableResFormate(
                tableId,
                userId,
                seatIndex,
                tableData["players"][seatIndex]["playerState"]
            );
            await SocketEventSend.sendEventToRoom(tableId, leaveTableRes);
            // remove from room
            await SocketEventSend.leaveClientInRoom(tableData["players"][seatIndex]["socketId"], tableId);

            let winnerData: any = {};
            for (const player of tableData["players"]) {
                if (userId !== player["userId"]) {
                    winnerData = {
                        "userId": player["userId"],
                        "seatIndex": player["seatIndex"]
                    };
                }
            }
            // score board show
            await scoreboard(tableId, false, winnerData["userId"], winnerData["seatIndex"]);
            // pass
        } else if (tableData["tableState"] === TABLE_STATE.SCORE_BOARD) {
            // send leave event
            const leaveTableRes = leaveTableResFormate(
                tableId,
                userId,
                seatIndex,
                tableData["players"][seatIndex]["playerState"]
            );
            await SocketEventSend.sendEventToRoom(tableId, leaveTableRes);
            // remove from room
            await SocketEventSend.leaveClientInRoom(tableData["players"][seatIndex]["socketId"], tableId);

        }
    } catch (error) {
        console.log("----- leaveTable :: ERROR :: ", error);
    }
}
