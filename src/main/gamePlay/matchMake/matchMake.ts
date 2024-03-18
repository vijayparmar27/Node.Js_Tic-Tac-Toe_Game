import { error } from "console";
import { TABLE_STATE } from "../../../constants/tableState";
import logger from "../../../logger";
import { PlayingTableModel } from "../../../models/playingTable.model";
import UserModel from "../../../models/user.model";
import mongoService from "../../../services/mongo.service";
import { centerToastPopupFormat } from "../../formateEvent/commonPopup.formate";
import { matchMakingResFormate } from "../../formateEvent/matchMake.formateRes";
import { SocketEventSend } from "../../socket";
import { addTableIdInQueue } from "../../utils/manageTableQueue";
import { createDefaultTable, findTableQueue, insertPlayerInTable } from "./common";
import { Types  } from "mongoose";
import { MESSAGES } from "../../../constants";
import BullScheduler from "../../bull";

export async function matchMaking(loobyData: any, socket: any, ack?: Function): Promise<void> {
    try {
        logger.info("------>> matchMaking :: loobyData :: ", loobyData);


        const userId = socket['userId'];
        const userName = socket['username'];

        // Check balance

        // Find available table for that lobby
        let tableId = await findTableQueue(loobyData["_id"]);
        logger.info("------>> matchMaking :: tableId :: ", tableId);

        // If no data found, create a new table
        if (!tableId) {
            tableId = await createDefaultTable(userId, loobyData["gameType"], String(loobyData["_id"]), loobyData["amount"]);
        }


        logger.info("------>> matchMaking :: tableId :: 1 ::", tableId);
        const tableData = await mongoService.findOne(PlayingTableModel, { query: { "_id": new Types.ObjectId(tableId as string) } });
        logger.info("------>> matchMaking :: tableData ::", tableData);

        const info = await insertPlayerInTable(tableData, userId, userName, socket.id);
        logger.info("------>> matchMaking :: info ::", info);

        // Seating in table
        if (!info) {
            // return matchMaking(loobyData, socket, ack);
            throw error;
        }

        const updateTableData = info["updatedData"];
        // Join socket room
        await SocketEventSend.addClientInRoom(socket, String(updateTableData["_id"]))

        // Save data in socket
        socket.tableId = String(updateTableData["_id"]);
        socket.seatIndex = info["index"];

        // Send event of matchMake
        const matchMakeRes = await matchMakingResFormate(updateTableData, userId);
        await SocketEventSend.sendEventToRoom(String(updateTableData["_id"]), matchMakeRes);

        logger.info("------>> matchMaking :: tableData :: addInRoom :");
        await mongoService.findOneAndUpdate(
            UserModel,
            {
                query: {
                    "_id": String(userId)
                },
                updateData: {
                    "$set": {
                        "lastTableId": String(updateTableData["_id"])
                    }
                }
            }
        );

        // Wait for other player to join
        if (updateTableData["activePlayers"] === 1) {
            // Send wait popup
            const popupRes = await centerToastPopupFormat("Wait for Other player to Join Game.");
            logger.info("------>> matchMaking :: popup_res ::", popupRes);

            await SocketEventSend.sendEventToRoom(String(updateTableData["_id"]), popupRes);
            // Add Queue
            await addTableIdInQueue(loobyData["_id"], tableId as string);
            return;
        } else if (updateTableData["activePlayers"] === updateTableData["maxPlayers"]) {
            // Change table state
            // Update date
            await mongoService.findOneAndUpdate(
                PlayingTableModel,
                {
                    query: {
                        "_id": String(updateTableData["_id"])
                    },
                    updateData: {
                        "$set": {
                            "updateAt": new Date(),
                            "tableState": TABLE_STATE.ROUND_TIMER_START
                        }
                    }
                }
            );

            // Send popup
            const time = 5;
            const popupRes = centerToastPopupFormat("Round start in 0 second", MESSAGES.ALERT.TYPE.MIDDLE_TOAST_POPUP, time);
            logger.info("------>> matchMaking :: popup_res ::", popupRes);
            await SocketEventSend.sendEventToRoom(String(updateTableData["_id"]), popupRes);

            // // Start round timer
            BullScheduler.addJob.roundTimerStartQueue({
                timer : time * 1000,
                jobId :  String(updateTableData["_id"]),
                tableId :  String(updateTableData["_id"])
            })
        }
    } catch (e) {
        logger.info("======= matchMaking :: ERROR :: ", e);
    }
}
