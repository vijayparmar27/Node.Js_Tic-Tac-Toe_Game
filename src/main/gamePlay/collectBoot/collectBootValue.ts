import { BULL_TIMER } from "../../../constants";
import { TABLE_STATE } from "../../../constants/tableState";
import logger from "../../../logger";
import { PlayingTableModel } from "../../../models/playingTable.model";
import UserModel from "../../../models/user.model";
import mongoService from "../../../services/mongo.service";
import BullScheduler from "../../bull";
import { collectBootValueFormateRes } from "../../formateEvent/collectBootValue.formateRes";
import { SocketEventSend } from "../../socket";

export async function collectBootValue(tableId: string): Promise<void> {
    try {
        logger.info("------ collectBootValue :: ");

        const tableData = await mongoService.findOne(
            PlayingTableModel,
            {
                query: {
                    "_id": mongoService.ObjectId(tableId)
                }
            }
        );
        logger.info("------ collectBootValue :: tableData :: ", tableData);

        if (!tableData) {
            return;
        }

        const userData: any[] = [];
        for (const player of tableData["players"]) {
            if (player && 'userId' in player) {
                const updateUserData = await mongoService.findOneAndUpdate(
                    UserModel,
                    {
                        query: {
                            "_id": mongoService.ObjectId(player.userId)
                        },
                        updateData: {
                            "$inc": {
                                "amount": -tableData["bootValue"]
                            },
                            "$set": {
                                "updateAt": new Date()
                            }
                        }
                    }
                );
                userData.push({
                    "userId": player["userId"],
                    "balance": updateUserData["amount"],
                    "seatIndex": player["seatIndex"]
                });
            }
        }
        logger.info("------ collectBootValue :: userData :: ", userData);

        await mongoService.findOneAndUpdate(
            PlayingTableModel,
            {
                query: {
                    "_id": mongoService.ObjectId(tableId)
                },
                updateData: {
                    "$set": {
                        "updateAt": new Date(),
                        "tableState": TABLE_STATE.COLLECT_BOOT
                    }
                }
            }
        );

        const collectBootRes = collectBootValueFormateRes(
            userData,
            tableData["bootValue"],
            tableData["potValue"],
            tableId
        );
        logger.info("------ collectBootValue :: collectBootRes :: ", collectBootRes);
        
        // emit event for collect boot
        await SocketEventSend.sendEventToRoom(tableId, collectBootRes)

        BullScheduler.addJob.collectBootTimerQueue({
            timer: BULL_TIMER.COLLECT_BOOT_TIMRT * 1000,
            jobId: tableId,
            tableId: tableId
        });

    } catch (error) {
        logger.error("===== collectBootValue :: ERROR :: ", error);
    }
}