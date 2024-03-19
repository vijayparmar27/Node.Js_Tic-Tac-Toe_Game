import { TABLE_STATE } from "../../../constants/tableState";
import logger from "../../../logger";
import { PlayingTableModel } from "../../../models/playingTable.model";
import mongoService from "../../../services/mongo.service";
import BullScheduler from "../../bull";
import { takeTurnResFormate } from "../../formateEvent/takeTurn.formateRes";
import { scoreboard } from "../../gamePlay/scoreboard/scoreboard";
import { changeTurn } from "../../gamePlay/turn/changeTurn";
import { checkWinner } from "../../gamePlay/winner/checkWinner";
import { SocketEventSend } from "../../socket";

export async function takeTurnHandler(
    { data }: any,
    socket: any,
    ack?: any
): Promise<void> {
    try {
        logger.info("----- takeTurnHandler :: data :: ", data);

        const tableId = socket["tableId"];
        const userId = socket["userId"];
        const seatIndex = socket["seatIndex"];

        const tableData = await mongoService.findOne(
            PlayingTableModel,
            {
                query: {
                    "_id": mongoService.ObjectId(tableId)
                }
            }
        );
        logger.info("----- takeTurnHandler :: tableData :: ", tableData);

        const symbol = tableData["players"][seatIndex]["symbol"];
        logger.info("----- takeTurnHandler :: symbol :: ", symbol);

        if (tableData["currentTurnUserId"] !== userId) {
            // send popup
            return;
        }

        if (tableData["tableState"] !== TABLE_STATE.PLAYING_START) {
            return;
        }

        logger.info("----- takeTurnHandler :: tableData['gameBoard'][data.index] :: ", tableData["gameBoard"][data.index]);
        if (tableData["gameBoard"][data.index] !== "") {
            // send popup
            return;
        }

        // cancel turn timer
        await BullScheduler.cancelJob.turnTimerCancel(String(tableId))

        logger.info("-------- takeTurnHandler :: set :: ", {
            [`gameBoard.${data.index}`]: symbol,
            [`players.${seatIndex}.isTakeTurn`]: true,
            "updateAt": new Date(),
        });

        // update game board
        const updateTableData = await mongoService.findOneAndUpdate(
            PlayingTableModel,
            {
                query: {
                    "_id": mongoService.ObjectId(tableId)
                },
                updateData: {
                    "$set": {
                        [`gameBoard.${data.index}`]: symbol,
                        [`players.${seatIndex}.isTakeTurn`]: true,
                        "updateAt": new Date(),
                    },
                    "$inc": {
                        "totalTurns": 1
                    }
                },
                updateOptions: {
                    returnDocument: "after"
                }
            }
        );

        // send event
        const takeTurnRes = takeTurnResFormate(
            data.index,
            symbol,
            tableId
        );
        await SocketEventSend.sendEventToRoom(tableId, takeTurnRes);
        // if check winner or tie
        const checkWinnerData = await checkWinner(updateTableData["gameBoard"], updateTableData["gameType"]);

        logger.info("----- takeTurnHandler :: checkWinnerData :: ", checkWinnerData);

        if (checkWinnerData["isWinner"] || checkWinnerData["isTie"]) {
            // show scoreboard 
            const winnerId = checkWinnerData["isWinner"] ? userId : "";
            const winnerIndex = checkWinnerData["isWinner"] ? seatIndex : -1;
            logger.info("-------  winnerId :: ", winnerId);
            logger.info("-------  winnerIndex :: ", winnerIndex);

            await scoreboard(tableId, checkWinnerData["isTie"], winnerId, winnerIndex);
        } else {
            // else change turn
            await changeTurn(
                userId,
                seatIndex,
                tableId
            );
        }

    } catch (error) {
        logger.error("------ takeTurnHandler :: ERROR :: ", error);
    }
}
