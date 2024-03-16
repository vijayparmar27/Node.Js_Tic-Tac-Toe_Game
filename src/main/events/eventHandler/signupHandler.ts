import { MESSAGES } from "../../../constants";
import logger from "../../../logger";
import { socketTokenVerify } from "../../../middlewares/socketTokenVerify";
import UserModel from "../../../models/user.model";
import mongoService from "../../../services/mongo.service";
import { commonPopupFormat } from "../../formateEvent/commonPopup.formate";
import { signupFormateResponce } from "../../formateEvent/signup.formateRes";
import { SocketEventSend } from "../../socket";

export async function signupHandler(
    { data }: any,
    socket: any,
    ack: Function
) {
    try {

        logger.info("----- signupHandler :: data :: ", data);

        if ('token' in data) {
            const userId = await socketTokenVerify(data.token);
            logger.info("------- signupHandler :: userId :: ", userId);
            if (!userId) {
                const res = commonPopupFormat("Invalid Token !", 1, [MESSAGES.ALERT.BUTTON_TEXT.EXIT], [
                    MESSAGES.ALERT.BUTTON_COLOR.RED], [MESSAGES.ALERT.BUTTON_METHOD.EXIT]);
                await SocketEventSend.sendEventToClient(res, socket);
                return;
            }

            socket.userId = userId

        } else {
            const res = commonPopupFormat("token unavailble !", 1, [MESSAGES.ALERT.BUTTON_TEXT.EXIT], [
                MESSAGES.ALERT.BUTTON_COLOR.RED], [MESSAGES.ALERT.BUTTON_METHOD.EXIT]);
            await SocketEventSend.sendEventToClient(res, socket);
            return;
        }

        const userData = await mongoService.findOne(
            UserModel,
            {
                query: {
                    "_id": socket.userId
                }
            }
        );

        logger.info("---- userdata : ", userData);

        if (userData) {
            socket.username = userData.userName
        } else {
            const res = commonPopupFormat("user not found !", 1, [MESSAGES.ALERT.BUTTON_TEXT.EXIT], [
                MESSAGES.ALERT.BUTTON_COLOR.RED], [MESSAGES.ALERT.BUTTON_METHOD.EXIT]);
            await SocketEventSend.sendEventToClient(res, socket);
            return;
        }

        let isRejoin = false;
        // if (userData["lastTableId"] !== "") {
        //     const tableData = await mongoService.findOne(
        //         CONSTANT.MONGO_COLLECTION.PLAYING_TABLE,
        //         { "_id": ObjectId(userData["lastTableId"]) }
        //     );
        //     isRejoin = !!tableData;
        // }

        const info = {
            "userName": userData["userName"],
            "amount": userData["amount"],
            "win": userData["win"],
            "loss": userData["loss"],
            "tie": userData["tie"],
            "isRejoin": isRejoin
        };

        const signupRes = await signupFormateResponce(info);

        await SocketEventSend.sendEventToClient(signupRes, socket);

    } catch (error) {
        logger.error(`----- signupHandler :: ERROR :: `, error)
    }
}