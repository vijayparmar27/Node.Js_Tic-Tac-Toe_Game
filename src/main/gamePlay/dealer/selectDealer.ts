import { BULL_TIMER } from "../../../constants";
import { TABLE_STATE } from "../../../constants/tableState";
import { PlayingTableModel } from "../../../models/playingTable.model";
import mongoService from "../../../services/mongo.service";
import BullScheduler from "../../bull";
import { selectDealerFormateRes } from "../../formateEvent/selectDealer.formateRes";
import { SocketEventSend } from "../../socket";

export async function selectDealer(tableId: string): Promise<void> {
    try {
        console.log("------ selectDealer :: ");
        const tableData = await mongoService.findOne(
            PlayingTableModel,
            {
                query: {
                    "_id": mongoService.ObjectId(tableId)
                }
            }
        );
        console.log("------ selectDealer :: tableData :: ", tableData);

        const random_integer = Math.floor(Math.random() * 2);

        console.log("------ selectDealer :: random_integer :: ", random_integer);

        const playersData: any[] = [];
        let dealerData: any = {};
        for (const player of tableData["players"]) {
            if (player && 'userId' in player) {
                const symbol = (random_integer === player["seatIndex"]) ? "O" : "X";
                console.log("------ selectDealer :: symbol :: ", symbol);
                if (random_integer === player["seatIndex"]) {
                    dealerData = {
                        "userId": player["userId"],
                        "seatIndex": player["seatIndex"]
                    };
                }
                playersData.push({
                    "userId": player["userId"],
                    "seatIndex": player["seatIndex"],
                    "symbol": symbol
                });
                console.log("------ selectDealer :: dealerData :: ", dealerData);
                await mongoService.findOneAndUpdate(
                    PlayingTableModel,
                    {
                        query: {
                            "_id": mongoService.ObjectId(tableId),
                            "players.userId": player["userId"]
                        },
                        updateData: {
                            "$set": {
                                "players.$.symbol": symbol
                            }
                        }
                    }
                );
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
                        "dealerIndex": dealerData["seatIndex"],
                        "dealerUserId": dealerData["userId"],
                        "updateAt": new Date(),
                        "tableState": TABLE_STATE.SELECT_DEALER
                    }
                }
            }
        );

        // send event
        const dealerRes = selectDealerFormateRes(playersData, tableId);
        await SocketEventSend.sendEventToRoom(tableId.toString(), dealerRes);

        // add scheduler
        BullScheduler.addJob.dealerTimerQueue({
            timer: BULL_TIMER.SELECT_DEALER * 1000,
            jobId: tableId,
            tableId: tableId
        });
        
    } catch (error) {
        console.log("------ selectDealer :: ERROR :: ", error);
    }
}
