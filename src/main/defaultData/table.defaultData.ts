import { ObjectId } from 'mongodb'; // Import ObjectId type from MongoDB library

export async function tableDefaultData(
    gameType: number,
    lobbyId: string,
    bootValue: number
): Promise<any> {
    try {
        const gameBoard: string[] = [];
        for (let i = 0; i < gameType * gameType; i++) {
            gameBoard.push("");
        }

        return {
            "activePlayers": 0,
            "totalPlayers": 0,
            "maxPlayers": 2,
            "gameType": gameType,
            "tableState": "",
            "currentTurnUserId": "",
            "currentTurnIndex": -1,
            "dealerIndex": -1,
            "dealerUserId": "",
            "totalTurns": 0,
            "isGameEnd": false,
            "lobbyId": lobbyId,
            "bootValue": bootValue,
            "potValue": bootValue * 2,
            "userIds": [],
            "isTie": false,
            "players": [
                {},
                {}
            ],
            "gameBoard": gameBoard,
            "createAt": new Date(),
            "updateAt": new Date()
        };
    } catch (e) {
        console.log("======= tableDefaultData :: ERROR : ", e);
        return null;
    }
}
