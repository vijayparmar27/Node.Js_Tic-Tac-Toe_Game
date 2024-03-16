import { MESSAGES } from "../../../constants";
import { commonPopupFormat } from "../../formateEvent/commonPopup.formate";

export async function signupHandler(
    { data }: any,
    socket: any,
    ack: Function
) {
    try {

        console.log("----- signupHandler :: data :: ", data);

        if ('token' in data) {
            const userId = await Token.verify_token_for_event(data.token);
            console.log("------- signupHandler :: userId :: ", userId);
            if (!userId) {
                const res = commonPopupFormat("Invalid Token !", 1, [MESSAGES.ALERT.BUTTON_TEXT.EXIT], [
                    MESSAGES.ALERT.BUTTON_COLOR.RED], [MESSAGES.ALERT.BUTTON_METHOD.EXIT]);
                await event_send(socketId, res);
                return;
            }
        } else {
            const res = commonPopupFormat("token unavailble !", 1, [MESSAGES.ALERT.BUTTON_TEXT.EXIT], [
                MESSAGES.ALERT.BUTTON_COLOR.RED], [MESSAGES.ALERT.BUTTON_METHOD.EXIT]);
            await event_send(socketId, res);
            return;
        }

        const userData = await mongoService.command.findOne(
            "users",
            { "_id": ObjectId(userId) }
        );

        console.log("---- userdata : ", userData);

        if (userData) {
            await io.save_session(socketId, { 'username': userData["userName"], 'userId': userId });
        } else {
            const res = common_popup_formate("user not found !", 1, [MESSAGES.POPUP.BUTTON_TEXT.EXIT], [
                MESSAGES.POPUP.BUTTON_COLOR.RED], [MESSAGES.POPUP.BUTTON_METHOD.EXIT]);
            await event_send(socketId, res);
            return;
        }

        let isRejoin = false;
        if (userData["lastTableId"] !== "") {
            const tableData = await mongoService.command.findOne(
                CONSTANT.MONGO_COLLECTION.PLAYING_TABLE,
                { "_id": ObjectId(userData["lastTableId"]) }
            );
            isRejoin = !!tableData;
        }

        const info = {
            "userName": userData["userName"],
            "amount": userData["amount"],
            "win": userData["win"],
            "loss": userData["loss"],
            "tie": userData["tie"],
            "isRejoin": isRejoin
        };

        const signup_res = signupResponceFormate(info);

        await event_send(socketId, signup_res);

    } catch (error) {

    }
}