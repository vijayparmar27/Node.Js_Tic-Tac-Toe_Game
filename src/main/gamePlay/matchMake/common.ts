import mongoService from '../../../services/mongo.service';
import tableQueueModel from '../../../models/tableQueue.model';
import { removeFromQueue } from '../../utils/manageTableQueue';
import { tableDefaultData } from '../../defaultData/table.defaultData';
import { PlayingTableModel } from '../../../models/playingTable.model';
import { tablePlayerDefaultData } from '../../defaultData/playerTable.defaultData';
import { TABLE_STATE } from '../../../constants/tableState';
import logger from '../../../logger';

export async function findTableQueue(lobbyId: string): Promise<string | null> {
    try {
        // Get Queue
        const queueData = await mongoService.findOne(tableQueueModel, { query: { "lobbyId": lobbyId } });

        logger.info("======= findtable :: queueData ::", queueData);


        if (!queueData) {
            await new tableQueueModel({
                "lobbyId": lobbyId
            }).save()
            return null;
        }

        // Check Queue 
        if (queueData["tableIds"].length === 0) {
            return null;
        }

        await removeFromQueue(lobbyId, queueData["tableIds"][0].toString());
        return queueData["tableIds"][0];
    } catch (e) {
        logger.error("====== findTableQueue :: ERROR :: ", e);
        return null;
    }
}

export async function createDefaultTable(userId: string, gameType: number, lobby: string, bootValue: number): Promise<string | null> {
    try {
        logger.info("------>> createDefaultTable ::");
        const createdTable = await tableDefaultData(gameType, lobby, bootValue);
        console.log(`------- createDefaultTable :: createdTable :: `,createdTable)

        const tableData = await new PlayingTableModel(createdTable).save();
        console.log(`------- createDefaultTable :: tableData :: `,tableData)
        return tableData.id;
    } catch (exception) {
        logger.error("===== createDefaultTable :: ERROR :: ", exception);
        return null;
    }
}

export async function insertPlayerInTable(
    tableData: any,
    userId: string,
    userName: string,
    socketId: string
): Promise<{ updatedData: any, index: number } | null> {
    try {
        let index: number = -1;
        let count: number = 0;

        for (const player of tableData["players"]) {
            if (Object.keys(player).length === 0) {
                index = count;
                break;
            }
            count++;
        }

        if (index === -1) {
            return null;
        }

        const data = await tablePlayerDefaultData(userId, index, socketId, userName);

        logger.info("======>> insertPlayerInTable :: data : ", data);

        const updatedData = await mongoService.findOneAndUpdate(
            PlayingTableModel,
            {
                query: { "_id": tableData["_id"] },
                updateData: {
                    "$set": {
                        "tableState": TABLE_STATE.WATING_PLAYER,
                        [`players.${index}`]: data
                    },
                    "$inc": {
                        "activePlayers": 1,
                        "totalPlayers": 1,
                    }
                },
                updateOptions : {
                    returnNewDocument: true
                }
            }
        );

        logger.info("======>> insertPlayerInTable :: updatedData : ", updatedData);

        return {
            "updatedData": updatedData,
            "index": index
        };

    } catch (e) {
        logger.error("======= insertPlayerInTable :: ERROR :: ", e);
        return null;
    }
}
