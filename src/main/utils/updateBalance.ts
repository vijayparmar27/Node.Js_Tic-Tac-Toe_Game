import UserModel from "../../models/user.model";
import mongoService from "../../services/mongo.service";

export async function updateBalance(tableData: any, isTie: boolean, winnerId: string = ""): Promise<void> {
    try {
        for (const player of tableData["players"]) {
            await mongoService.findOneAndUpdate(
                UserModel,
                {
                    query: {
                        "_id": mongoService.ObjectId(player["userId"])
                    },
                    updateData: {
                        "$inc": {
                            "amount": winnerId === player["userId"] ? tableData["potValue"] : (isTie ? tableData["potValue"] / tableData["maxPlayers"] : 0),
                            "win": winnerId === player["userId"] ? 1 : 0,
                            "tie": isTie ? 1 : 0,
                            "loss": (!isTie && winnerId !== player["userId"]) ? 1 : 0
                        },
                        "$set": {
                            "lastTableId": ""
                        }
                    }
                }
            );
        }
    } catch (error) {
        console.log("----- updateBalance :: ERROR :: ", error);
    }
}

export async function addBalance(userId: string, amount: number): Promise<void> {
    try {
        await mongoService.findOneAndUpdate(
            UserModel,
            {
                query: {
                    "_id": mongoService.ObjectId(userId)
                },
                updateData: {
                    "$inc": {
                        "amount": amount
                    },
                    "$set": {
                        "lastTableId": ""
                    }
                }
            }
        );
    } catch (error) {
        console.log("------ addBalance :: ERROR :: ", error);
    }
}
