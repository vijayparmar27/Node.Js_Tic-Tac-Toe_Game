import { EVENTS } from "../../constants";
import logger from "../../logger";

export async function signupFormateResponce(data: any) {
    try {
        return {
            en: EVENTS.SIGN_UP,
            data: data
        }
    } catch (error) {
        logger.error(`------- signupFormateResponce :: error :: `, error);
        throw error;
    }
}