import { BULL_TIMER, MESSAGES } from "../../../constants";
import { TABLE_STATE } from "../../../constants/tableState";
import { PlayingTableModel } from "../../../models/playingTable.model";
import UserModel from "../../../models/user.model";
import mongoService from "../../../services/mongo.service";
import { commonPopupFormat } from "../../formateEvent/commonPopup.formate";
import { rejoinResFormate } from "../../formateEvent/rejoin.formateRes";
import { SocketEventSend } from "../../socket";

export async function rejoinHandler({ data }: any, socket: any, ack?: Function): Promise<void> {
    try {
        console.log("----- rejoinHandler :: ::");

        const userId: string = socket["userId"];

        const userData = await mongoService.findOne(
            UserModel,
            {
                query: {
                    "_id": mongoService.ObjectId(userId)
                }
            }
        );

        if (userData["lastTableId"] !== "") {
            const tableData = await mongoService.findOne(
                PlayingTableModel,
                {
                    query: {
                        "_id": mongoService.ObjectId(userData.lastTableId)
                    }
                }
            );
            if (tableData) {
                if (tableData["tableState"] !== TABLE_STATE.SCORE_BOARD) {
                    let timer: number = BULL_TIMER.ROUND_START_TIMER;

                    if (tableData["tableState"] === TABLE_STATE.ROUND_TIMER_START) {
                        timer = BULL_TIMER.ROUND_START_TIMER;
                    } else if (tableData["tableState"] === TABLE_STATE.COLLECT_BOOT) {
                        timer = BULL_TIMER.COLLECT_BOOT_TIMRT;
                    } else if (tableData["tableState"] === TABLE_STATE.SELECT_DEALER) {
                        timer = BULL_TIMER.SELECT_DEALER;
                    } else if (tableData["tableState"] === TABLE_STATE.PLAYING_START) {
                        timer = BULL_TIMER.TOTAL_TURN_TIMER;
                    }

                    console.log("------- rejoinHandler :: timer :: ", timer);

                    let seatIndex: number = -1;
                    for (const player of tableData["players"]) {
                        if (player["userId"] === userId) {
                            seatIndex = player["seatIndex"];
                            break;
                        }
                    }

                    socket.tableId = String(userData["lastTableId"])
                    socket.seatIndex = seatIndex

                    await SocketEventSend.addClientInRoom(socket, String(userData["lastTableId"]));
                    const rejoinRes = await rejoinResFormate(tableData, userId, timer);
                    console.log("------- rejoinHandler :: rejoinRes :: ", rejoinRes);
                    await SocketEventSend.sendEventToClient(socket, rejoinRes);

                    return;
                } else {
                    const res = commonPopupFormat("previous table over !", 1, [MESSAGES.ALERT.BUTTON_TEXT.EXIT], [
                        MESSAGES.ALERT.BUTTON_COLOR.RED], [MESSAGES.ALERT.BUTTON_METHOD.EXIT]);
                    await SocketEventSend.sendEventToClient(socket, res);

                    return;
                }
            }
        }
    } catch (error) {
        console.log("----- rejoinHandler :: ERROR :: ", error);
    }
}
