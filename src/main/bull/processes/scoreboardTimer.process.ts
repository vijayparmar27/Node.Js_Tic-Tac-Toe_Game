import logger from "../../../logger";
import { PlayingTableModel } from "../../../models/playingTable.model";
import mongoService from "../../../services/mongo.service";
import { SocketEventSend } from "../../socket";

export async function scoreboardTimerProcess(job: any) {
    try {
        logger.info("---->> scoreboardTimerProcess :: JOB ::", job)
        logger.info("---->> scoreboardTimerProcess :: Job Data ::", job.data)

        // clear table data
        const tableData = await mongoService.findOne(
            PlayingTableModel,
            {
                query: {
                    "_id": mongoService.ObjectId(job.data["tableId"])
                }
            }
        );

        for (const player of tableData["players"]) {
            await SocketEventSend.leaveClientInRoom(player["socketId"], job.data["tableId"]);
        }

        await mongoService.deleteOne(
            PlayingTableModel,
            {
                query: {
                    "_id": mongoService.ObjectId(job.data["tableId"])
                }
            }
        );

    } catch (error) {
        logger.error(`------- scoreboardTimerProcess :: ERROR :: `, error);
    }
}