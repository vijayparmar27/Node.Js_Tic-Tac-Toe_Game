import { TABLE_STATE } from "../../constants/tableState";
import logger from "../../logger";
import { PlayingTableModel } from "../../models/playingTable.model";
import mongoService from "../../services/mongo.service";
import BullScheduler from "../bull";
import { leaveTableResFormate } from "../formateEvent/leaveTable.formateRes";
import { SocketEventSend } from "../socket";
import { removeFromQueue } from "../utils/manageTableQueue";
import { addBalance } from "../utils/updateBalance";

export async function disconnectSocket(socket: any, disconnectReason: string): Promise<void> {
    try {
        // add timer

        if ("tableId" in socket) {
            const tableData = await mongoService.findOne(
                PlayingTableModel,
                {
                    query: {
                        "_id": mongoService.ObjectId(socket['tableId'])
                    }
                }
            );

            const tableId: string = socket['tableId'];
            const userId: string = socket['userId'];
            const seatIndex: number = socket['seatIndex'];

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
                await SocketEventSend.leaveClientInRoom(socket, tableId);
                // add balance
                await addBalance(userId, tableData["bootValue"]);

                // delete table
                await mongoService.deleteOne(
                    PlayingTableModel,
                    {

                        query: {
                            "_id": mongoService.ObjectId(tableId)
                        }
                    }
                );

            } else if (tableData["tableState"] !== TABLE_STATE.SCORE_BOARD) {
                BullScheduler.addJob.rejoinTimerQueue({
                    "tableId": socket['tableId'],
                    "username": socket['username'],
                    "timer": 60 * 1000,
                });
            }
        }
    } catch (error) {
        logger.info("----- disconnect :: ERROR :: ", error);
    }
}
