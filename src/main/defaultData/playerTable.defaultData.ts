import { ObjectId } from 'mongodb'; // Import ObjectId type from MongoDB library
import { PLAYER_STATE } from '../../constants';

export async function tablePlayerDefaultData(userId: string, seatIndex: number, socketId: string, userName: string): Promise<any> {
    try {
        return {
            "userId": userId,
            "userName": userName,
            "playerState": PLAYER_STATE.PLAYING,
            "seatIndex": seatIndex,
            "rematch": false,
            "isTakeTurn": false,
            "turnMissCount": 0,
            "symbol": "",
            "socketId": socketId,
            "createAt": new Date(),
            "updateAt": new Date()
        };
    } catch (e) {
        console.log("====== tablePlayerDefaultData :: ", e);
        return null;
    }
}
