import { eventNames } from "process";
import { EVENTS } from "../../constants";
import logger from "../../logger";
import { signupHandler } from "./eventHandler/signupHandler";
import { lobbyHandler } from "./eventHandler/lobbyHandler";
import { matchMakeHandler } from "./eventHandler/matchMakeHandler";

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
            logger.warn("======>>> Event : Unity-Side ==>>", reqEventName)
            logger.warn("======>>> Event : Unity-Side ==>>", body)
        }

        const data = body;


        switch (reqEventName) {

            case EVENTS.SIGN_UP:
                signupHandler(data,socket,ack)
                break;
            case EVENTS.LOBBY:
                lobbyHandler(data,socket,ack)
                break;
            case EVENTS.MATCH_MAKE:
                matchMakeHandler(data,socket,ack)
                break;

            default:
                logger.warn(`----- requestHandler :: CALL DEFAULT ::`)
                break;

        }

    } catch (error) {
        logger.error("----- requestHandler :: ERROR :: ", error)
    }
}