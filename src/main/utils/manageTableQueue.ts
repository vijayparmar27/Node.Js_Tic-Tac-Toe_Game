import tableQueueModel from "../../models/tableQueue.model";
import mongoService from "../../services/mongo.service";

export async function addTableIdInQueue(lobbyId: string, tableId: string): Promise<void> {
    try {
        await mongoService.findOneAndUpdate(
            tableQueueModel,
            {
                query : {
                     "lobbyId": lobbyId 
                },
                updateData : {
                    "$push": { "tableIds": tableId } 
                },
                updateOptions : {
                    returnDocument : "after"
                }
            }
        );
    } catch (e) {
        console.log("------ addTableIdInQueue :: ERROR :: ", e);
    }
}

export async function removeFromQueue(lobbyId: string, tableId: string): Promise<void> {
    try {
        await mongoService.findOneAndUpdate(
            tableQueueModel,
            {
                query : {
                     "lobbyId": lobbyId 
                },
                updateData : {
                    "$pull": { "tableIds": tableId }
                },
                updateOptions : {
                    returnDocument : "after"
                }
            }
        );
    } catch (e) {
        console.log("------ removeFromQueue :: ERROR :: ", e);
    }
}
