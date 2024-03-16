import { eventNames } from "process";
import { EVENTS } from "../../constants";
import logger from "../../logger";

export async function requestHandler(
    this: any,
    [reqEventName, payload, ack]: Array<any>,
    // @ts-ignore
    next,
): Promise<void> {
    try {

        const socket: any = this;

        const body = payload = typeof payload === "string" ? JSON.parse(payload) : payload;

        if (!socket) {
            logger.error(new Error('socket instance not found'));
        }

        if (body.en !== EVENTS.HEART_BEAT) {
            logger.info("======>>> Event : Unity-Side ==>>", body)
            logger.info("======>>> Event : Unity-Side ==>>", reqEventName)
        }

        const data = body;


        switch (reqEventName) {

            case EVENTS.SIGN_UP:
                break;

            default:
                logger.warn(`----- requestHandler :: CALL DEFAULT ::`)
                break;

        }

    } catch (error) {
        logger.error("----- requestHandler :: ERROR :: ", error)
    }
}