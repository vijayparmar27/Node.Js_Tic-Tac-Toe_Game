import { BULL_TIMER, PLAYER_STATE } from "../../../constants";
import { TABLE_STATE } from "../../../constants/tableState";
import logger from "../../../logger";
import { PlayingTableModel } from "../../../models/playingTable.model";
import mongoService from "../../../services/mongo.service";
import BullScheduler from "../../bull";
import { scoreboardResFormate } from "../../formateEvent/scoreboard.formateRes";
import { SocketEventSend } from "../../socket";
import { updateBalance } from "../../utils/updateBalance";

export async function scoreboard(
    tableId: string,
    isTie: boolean,
    winnerId: string = "",
    winnerSeatIndex: number = -1
): Promise<void> {
    try {
        logger.info("------- scoreboard :: tableId :: ", tableId);

        // update table state
        const tableData = await mongoService.findOneAndUpdate(
            PlayingTableModel,
            {
                query: {
                    "_id": mongoService.ObjectId(tableId)
                },
                updateData: {
                    "$set": {
                        "tableState": TABLE_STATE.SCORE_BOARD,
                        "updateAt": new Date(),
                        "isTie": isTie,
                        "players.0.playerState": isTie ? PLAYER_STATE.TIE : (winnerSeatIndex === 0 ? PLAYER_STATE.WIN : PLAYER_STATE.LOSS),
                        "players.1.playerState": isTie ? PLAYER_STATE.TIE : (winnerSeatIndex === 1 ? PLAYER_STATE.WIN : PLAYER_STATE.LOSS)
                    }
                },
                updateOptions : {
                    returnDocument : "after"
                }
            }
        );
        logger.info("------- scoreboard :: tableData :: ", tableData);

        // update balance
        // add win - loss - tie
        await updateBalance(tableData, isTie, winnerId);

        // send event
        const scoreboard_res = await scoreboardResFormate(tableData, 5);
        logger.info("------- scoreboard :: scoreboard_res :: ", scoreboard_res);
        await SocketEventSend.sendEventToRoom(tableId.toString(), scoreboard_res);

        // add scheduler
        BullScheduler.addJob.scoreboardTimerQueue({
            timer : BULL_TIMER.SCOREBOARD_TIMER,
            tableId : tableId.toString()
        })
    } catch (error) {
        logger.error("----- scoreboard :: ERROR :: ", error);
    }
}
